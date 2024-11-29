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

// react-icons에서 아이콘 임포트
import { AiOutlineArrowUp, AiOutlineArrowDown } from "react-icons/ai";

// droplistdata에서 리스트들을 임포트
import {
  typelist,
  grouplist,
  turnlist,
  typeidlist,
  sortlist,
} from "@/components/droplistdata";

const SearchList = ({ name, number, categoryFilter, linkBase }) => {
  const setNameState = useSetRecoilState(searchnameState);
  const setNumberState = useSetRecoilState(searchnumberState);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });

  // 필터링 상태를 관리하는 state
  const [filters, setFilters] = useState({
    type: [],
    group: [],
    turn: [],
    submitturn: [],
    sort: [],
  });

  // 드롭다운 메뉴의 열림 상태를 관리하는 state
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

  // droplistdata의 리스트들을 사용하여 uniqueValues 생성
  const uniqueValues = {
    type: typelist,
    group: grouplist,
    turn: turnlist,
    submitturn: typeidlist,
    sort: sortlist,
  };

  const toggleDropdown = (key) => {
    setDropdownOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => {
      const values = prevFilters[key];
      if (values.includes(value)) {
        // 이미 선택된 값이면 제거
        const newValues = values.filter((v) => v !== value);
        return {
          ...prevFilters,
          [key]: newValues,
        };
      } else {
        // 선택되지 않은 값이면 추가
        const newValues = [...values, value];
        return {
          ...prevFilters,
          [key]: newValues,
        };
      }
    });
  };

  const handleFilterAllChange = (key) => {
    setFilters((prevFilters) => {
      if (prevFilters[key].length === uniqueValues[key].length) {
        // 모든 옵션이 선택된 상태면 모두 해제
        return {
          ...prevFilters,
          [key]: [],
        };
      } else {
        // 하나라도 선택되지 않은 옵션이 있으면 모두 선택
        return {
          ...prevFilters,
          [key]: uniqueValues[key].map((option) => option.value),
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

  // 아이콘을 반환하는 함수
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? (
        <AiOutlineArrowUp size={12} color="#7152F3" />
      ) : (
        <AiOutlineArrowDown size={12} color="#7152F3" />
      );
    }
    return <AiOutlineArrowDown size={12} />;
  };

  const handleReset = () => {
    setFilters({
      type: [],
      group: [],
      turn: [],
      submitturn: [],
      sort: [],
    });
    setSortConfig({
      key: null,
      direction: "ascending",
    });
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

    return data;
  };

  const handleDelete = async (id) => {
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
        {/* 관리번호 */}
        <div className={styles.unitContainer}>
          <span>
            관리번호
            <span className={styles.sortIcon} onClick={() => handleSort("id")}>
              {getSortIcon("id")}
            </span>
          </span>
        </div>
        {/* 성명 */}
        <div className={styles.unitContainer}>
          <span>
            성명
            <span
              className={styles.sortIcon}
              onClick={() => handleSort("name")}
            >
              {getSortIcon("name")}
            </span>
          </span>
        </div>
        {/* 타입 */}
        <div className={styles.unitContainer}>
          <span>
            <span onClick={() => toggleDropdown("type")}>타입</span>
            <span
              className={styles.sortIcon}
              onClick={() => handleSort("type")}
            >
              {getSortIcon("type")}
            </span>
          </span>
          {/* 드롭다운 메뉴 */}
          {dropdownOpen.type && (
            <div
              className={styles.dropdown}
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={filters.type.length === uniqueValues.type.length}
                    onChange={() => handleFilterAllChange("type")}
                  />
                  전체
                </label>
              </div>
              {uniqueValues.type.map((option) => (
                <div key={option.value}>
                  <label>
                    <input
                      type="checkbox"
                      checked={filters.type.includes(option.value)}
                      onChange={() => handleFilterChange("type", option.value)}
                    />
                    {option.item}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* 군 */}
        <div className={styles.unitContainer}>
          <span>
            <span onClick={() => toggleDropdown("group")}>군</span>
            <span
              className={styles.sortIcon}
              onClick={() => handleSort("group")}
            >
              {getSortIcon("group")}
            </span>
          </span>
          {dropdownOpen.group && (
            <div
              className={styles.dropdown}
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={filters.group.length === uniqueValues.group.length}
                    onChange={() => handleFilterAllChange("group")}
                  />
                  전체
                </label>
              </div>
              {uniqueValues.group.map((option) => (
                <div key={option.value}>
                  <label>
                    <input
                      type="checkbox"
                      checked={filters.group.includes(option.value)}
                      onChange={() => handleFilterChange("group", option.value)}
                    />
                    {option.item}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* 순번 */}
        <div className={styles.unitContainer}>
          <span>
            <span onClick={() => toggleDropdown("turn")}>순번</span>
            <span
              className={styles.sortIcon}
              onClick={() => handleSort("turn")}
            >
              {getSortIcon("turn")}
            </span>
          </span>
          {dropdownOpen.turn && (
            <div
              className={styles.dropdown}
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={filters.turn.length === uniqueValues.turn.length}
                    onChange={() => handleFilterAllChange("turn")}
                  />
                  전체
                </label>
              </div>
              {uniqueValues.turn.map((option) => (
                <div key={option.value}>
                  <label>
                    <input
                      type="checkbox"
                      checked={filters.turn.includes(option.value)}
                      onChange={() => handleFilterChange("turn", option.value)}
                    />
                    {option.item}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* 가입 차순 */}
        <div className={styles.unitContainer}>
          <span>
            <span onClick={() => toggleDropdown("submitturn")}>가입 차순</span>
            <span
              className={styles.sortIcon}
              onClick={() => handleSort("submitturn")}
            >
              {getSortIcon("submitturn")}
            </span>
          </span>
          {dropdownOpen.submitturn && (
            <div
              className={styles.dropdown}
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={
                      filters.submitturn.length ===
                      uniqueValues.submitturn.length
                    }
                    onChange={() => handleFilterAllChange("submitturn")}
                  />
                  전체
                </label>
              </div>
              {uniqueValues.submitturn.map((option) => (
                <div key={option.value}>
                  <label>
                    <input
                      type="checkbox"
                      checked={filters.submitturn.includes(option.value)}
                      onChange={() =>
                        handleFilterChange("submitturn", option.value)
                      }
                    />
                    {option.item}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* 가입 날짜 */}
        <div className={styles.unitContainer}>
          <span>
            가입 날짜
            <span
              className={styles.sortIcon}
              onClick={() => handleSort("submitdate")}
            >
              {getSortIcon("submitdate")}
            </span>
          </span>
        </div>
        {/* 분류 */}
        <div className={styles.unitContainer}>
          <div className={styles.headerWithReset}>
            <span onClick={() => toggleDropdown("sort")}>분류</span>
            <span
              className={styles.sortIcon}
              onClick={() => handleSort("sort")}
            >
              {getSortIcon("sort")}
            </span>
          </div>
          {dropdownOpen.sort && (
            <div
              className={styles.dropdown}
              onClick={(e) => e.stopPropagation()}
            >
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={filters.sort.length === uniqueValues.sort.length}
                    onChange={() => handleFilterAllChange("sort")}
                  />
                  전체
                </label>
              </div>
              {uniqueValues.sort.map((option) => (
                <div key={option.value}>
                  <label>
                    <input
                      type="checkbox"
                      checked={filters.sort.includes(option.value)}
                      onChange={() => handleFilterChange("sort", option.value)}
                    />
                    {option.item}
                  </label>
                </div>
              ))}
            </div>
          )}
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
