// src/components/SearchList.js
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { ModifyButton } from "@/components/Button";
import styles from "@/styles/Search.module.scss";
import { searchnameState, searchnumberState } from "@/utils/atom";
import { namesearchSelector } from "@/utils/selector";
import { deleteUser } from "@/utils/api";
import categoryMapping from "@/utils/categoryMapping"; // categoryMapping 불러오기
import ConfirmationModal from "@/components/ConfirmationModal"; // Import the modal
import Swal from "sweetalert2"; // SweetAlert2 import

const SearchList = ({ name, number, categoryFilter, linkBase }) => {
  const setNameState = useSetRecoilState(searchnameState);
  const setNumberState = useSetRecoilState(searchnumberState);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  let searchname = name.length > 1 ? name : "";
  let searchnumber = number.length > 1 ? number : "";

  useEffect(() => {
    setNameState(searchname);
    setNumberState(searchnumber);
  }, [searchname, searchnumber, setNameState, setNumberState]);

  let searchdata = useRecoilValueLoadable(namesearchSelector);

  if (searchdata.state === "loading") {
    return null;
  }

  if (searchdata.state === "hasError") {
    return <div>데이터를 불러오는 중 오류가 발생했습니다.</div>;
  }

  if (searchdata.state === "hasValue") {
    console.log("Received search data:", searchdata.contents);
  }

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = () => {
    let sortableData = [...searchdata.contents].filter((k) =>
      categoryFilter.includes(k.userinfo?.sort)
    );

    if (sortConfig.key !== null) {
      sortableData.sort((a, b) => {
        let aValue, bValue;

        if (sortConfig.key === "id") {
          aValue = parseInt(a[sortConfig.key], 10);
          bValue = parseInt(b[sortConfig.key], 10);
        } else {
          aValue = a.data[sortConfig.key] || a.userinfo[sortConfig.key];
          bValue = b.data[sortConfig.key] || b.userinfo[sortConfig.key];
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    console.log("Sorted data:", sortableData);

    return sortableData;
  };

  const handleDelete = async (id) => {
    console.log("Deleting user with id:", id);
    try {
      await deleteUser(id);
      // SweetAlert을 사용하여 성공 메시지 표시
      Swal.fire({
        icon: "success",
        title: "회원 삭제",
        text: "회원이 성공적으로 삭제되었습니다.",
        confirmButtonText: "확인",
      }).then(() => {
        // 페이지 새로고침
        window.location.reload();
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      // SweetAlert을 사용하여 오류 메시지 표시
      Swal.fire({
        icon: "error",
        title: "삭제 실패",
        text: "사용자 삭제 중 오류가 발생했습니다.",
        confirmButtonText: "확인",
      });
    }
  };

  const openConfirmation = (id) => {
    setSelectedUserId(id);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUserId !== null) {
      handleDelete(selectedUserId);
      setSelectedUserId(null);
      setIsModalOpen(false);
    }
  };

  const cancelDelete = () => {
    setSelectedUserId(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className={styles.tablecontainer}>
        {/* 테이블 헤더 */}
        <div className={styles.unitContainer}>
          <span onClick={() => handleSort("id")}>관리번호</span>
        </div>
        <div className={styles.unitContainer}>
          <span onClick={() => handleSort("name")}>성명</span>
        </div>
        <div className={styles.unitContainer}>
          <span onClick={() => handleSort("type")}>타입</span>
        </div>
        <div className={styles.unitContainer}>
          <span onClick={() => handleSort("group")}>군</span>
        </div>
        <div className={styles.unitContainer}>
          <span onClick={() => handleSort("turn")}>순번</span>
        </div>
        <div className={styles.unitContainer}>
          <span onClick={() => handleSort("submitturn")}>가입 차순</span>
        </div>
        <div className={styles.unitContainer}>
          <span onClick={() => handleSort("submitdate")}>가입 날짜</span>
        </div>
        <div className={styles.unitContainer}>
          <span onClick={() => handleSort("sort")}>분류</span>
        </div>
      </div>
      {searchdata.state === "hasValue" &&
        sortedData()
          .filter((k) => k.userinfo && k.data)
          .map((k) => {
            return (
              <div className={styles.maincontainer} key={k.id}>
                <Link href={`${linkBase}${k.id}`} className={styles.link}>
                  <div className={styles.rowContainer}>
                    <div className={styles.unitContainer}>{k.id}</div>
                    <div className={styles.unitContainer}>
                      {k.userinfo?.name || "N/A"}
                    </div>
                    <div className={styles.unitContainer}>
                      {k.data?.type || "N/A"}
                    </div>
                    <div className={styles.unitContainer}>
                      {k.data?.group || "N/A"}
                    </div>
                    <div className={styles.unitContainer}>
                      {k.data?.turn || "N/A"}
                    </div>
                    <div className={styles.unitContainer}>
                      {k.data?.submitturn || "N/A"}
                    </div>
                    <div className={styles.unitContainer}>
                      {k.data?.submitdate
                        ? k.data.submitdate.slice(0, 10)
                        : "N/A"}
                    </div>
                    <div className={styles.unitContainer}>
                      {categoryMapping[k.userinfo?.sort] || "N/A"}
                    </div>
                  </div>
                </Link>
                <div className={styles.unitContainer}>
                  <ModifyButton onClick={() => openConfirmation(k.id)}>
                    <div className={styles.CBBottonFont}>삭제</div>
                  </ModifyButton>
                </div>
              </div>
            );
          })}
      {isModalOpen && (
        <ConfirmationModal
          message="삭제하시겠습니까?"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
};

export default SearchList;
