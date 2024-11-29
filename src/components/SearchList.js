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
import categoryMapping from "@/utils/categoryMapping";
import ConfirmationModal from "@/components/ConfirmationModal";
import Swal from "sweetalert2";

const SearchList = ({ name, number, categoryFilter, linkBase }) => {
  const setNameState = useSetRecoilState(searchnameState);
  const setNumberState = useSetRecoilState(searchnumberState);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // 필터링 상태를 관리하는 state 추가
  const [filters, setFilters] = useState({
    type: [],
    group: [],
    turn: [],
    submitturn: [],
    sort: [],
  });

  // 드롭다운 메뉴의 열림 상태를 관리하는 state 추가
  const [dropdownOpen, setDropdownOpen] = useState({
    type: false,
    group: false,
    turn: false,
    submitturn: false,
    sort: false,
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

  // 각 컬럼별로 유니크한 값을 추출
  const uniqueValues = {
    type: Array.from(
      new Set(
        searchdata.contents.map((item) => item.data?.type).filter(Boolean)
      )
    ),
    group: Array.from(
      new Set(
        searchdata.contents.map((item) => item.data?.group).filter(Boolean)
      )
    ),
    turn: Array.from(
      new Set(
        searchdata.contents.map((item) => item.data?.turn).filter(Boolean)
      )
    ),
    submitturn: Array.from(
      new Set(
        searchdata.contents.map((item) => item.data?.submitturn).filter(Boolean)
      )
    ),
    sort: Array.from(
      new Set(
        searchdata.contents.map((item) => item.userinfo?.sort).filter(Boolean)
      )
    ),
  };

  const toggleDropdown = (key) => {
    setDropdownOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => {
      const values = prevFilters[key];
      if (values.includes(value)) {
        // 이미 선택된 값이면 제거
        return {
          ...prevFilters,
          [key]: values.filter((v) => v !== value),
        };
      } else {
        // 선택되지 않은 값이면 추가
        return {
          ...prevFilters,
          [key]: [...values, value],
        };
      }
    });
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const filteredData = () => {
    let data = [...searchdata.contents].filter((k) =>
      categoryFilter.includes(k.userinfo?.sort)
    );

    // 필터 적용
    Object.keys(filters).forEach((key) => {
      if (filters[key].length > 0) {
        data = data.filter((item) => {
          const itemValue = item.data?.[key] || item.userinfo?.[key];
          return filters[key].includes(itemValue);
        });
      }
    });

    // 정렬 적용
    if (sortConfig.key !== null) {
      data.sort((a, b) => {
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

    console.log("Filtered and Sorted data:", data);

    return data;
  };

  const handleDelete = async (id) => {
    console.log("Deleting user with id:", id);
    try {
      await deleteUser(id);
      Swal.fire({
        icon: "success",
        title: "회원 삭제",
        text: "회원이 성공적으로 삭제되었습니다.",
        confirmButtonText: "확인",
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error("Error deleting user:", error);
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

        {/* 타입 컬럼 */}
        <div className={styles.unitContainer}>
          <div onClick={() => toggleDropdown("type")}>
            타입
            {/* 드롭다운 메뉴 */}
            {dropdownOpen.type && (
              <div className={styles.dropdown}>
                {uniqueValues.type.map((value) => (
                  <div key={value}>
                    <label>
                      <input
                        type="checkbox"
                        checked={filters.type.includes(value)}
                        onChange={() => handleFilterChange("type", value)}
                      />
                      {value}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 군 컬럼 */}
        <div className={styles.unitContainer}>
          <div onClick={() => toggleDropdown("group")}>
            군
            {dropdownOpen.group && (
              <div className={styles.dropdown}>
                {uniqueValues.group.map((value) => (
                  <div key={value}>
                    <label>
                      <input
                        type="checkbox"
                        checked={filters.group.includes(value)}
                        onChange={() => handleFilterChange("group", value)}
                      />
                      {value}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 순번 컬럼 */}
        <div className={styles.unitContainer}>
          <div onClick={() => toggleDropdown("turn")}>
            순번
            {dropdownOpen.turn && (
              <div className={styles.dropdown}>
                {uniqueValues.turn.map((value) => (
                  <div key={value}>
                    <label>
                      <input
                        type="checkbox"
                        checked={filters.turn.includes(value)}
                        onChange={() => handleFilterChange("turn", value)}
                      />
                      {value}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 가입 차순 컬럼 */}
        <div className={styles.unitContainer}>
          <div onClick={() => toggleDropdown("submitturn")}>
            가입 차순
            {dropdownOpen.submitturn && (
              <div className={styles.dropdown}>
                {uniqueValues.submitturn.map((value) => (
                  <div key={value}>
                    <label>
                      <input
                        type="checkbox"
                        checked={filters.submitturn.includes(value)}
                        onChange={() => handleFilterChange("submitturn", value)}
                      />
                      {value}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 가입 날짜 컬럼 */}
        <div className={styles.unitContainer}>
          <span onClick={() => handleSort("submitdate")}>가입 날짜</span>
        </div>

        {/* 분류 컬럼 */}
        <div className={styles.unitContainer}>
          <div onClick={() => toggleDropdown("sort")}>
            분류
            {dropdownOpen.sort && (
              <div className={styles.dropdown}>
                {uniqueValues.sort.map((value) => (
                  <div key={value}>
                    <label>
                      <input
                        type="checkbox"
                        checked={filters.sort.includes(value)}
                        onChange={() => handleFilterChange("sort", value)}
                      />
                      {categoryMapping[value] || "N/A"}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {searchdata.state === "hasValue" &&
        filteredData()
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
