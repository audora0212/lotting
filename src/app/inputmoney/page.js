"use client";

import styles from "@/styles/Inputmoneysearch.module.scss";
import { Searchbox } from "@/components/Inputbox";
import Link from "next/link";
import { searchnameState, searchnumberState } from "@/utils/atom";
import { namesearchSelector } from "@/utils/selector";
import { useEffect, useState } from "react";
import { useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { CgSearch } from "react-icons/cg";
import withAuth from "@/utils/hoc/withAuth";

const SearchList = ({ name, number }) => {
  let searchname = name.length > 1 ? name : "";
  let searchnumber = number.length > 1 ? number : "";

  const setNameState = useSetRecoilState(searchnameState);
  const setNumberState = useSetRecoilState(searchnumberState);

  useEffect(() => {
    setNameState(searchname);
    setNumberState(searchnumber);
  }, [searchname, searchnumber, setNameState, setNumberState]);

  let searchdata = useRecoilValueLoadable(namesearchSelector);

  if (searchdata.state === "loading") {
    return <div>Loading...</div>;
  }

  if (searchdata.state === "hasError") {
    return <div>Error fetching data</div>;
  }

  if (searchdata.state === "hasValue") {
    return (
      <div>
        {searchdata.contents.map((k) => (
          <Link
            key={k.id}
            className={styles.MainContainer}
            href={`/inputmoney/userinfo/${k.id}`}
          >
            <div className={styles.CategoryContent}>
              <div className={styles.CategoryBody1}>
                <div className={styles.ContentFont}>{k.id}</div>
              </div>
              <div className={styles.CategoryBody1}>
                <div className={styles.ContentFont}>{k.userinfo.name}</div>
              </div>
              <div className={styles.CategoryBody1}>
                <div className={styles.ContentFont}>
                  {k.data.type}-{k.data.group}-{k.data.turn}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  return null;
};

function Inputmoneysearch() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");

  const onNameChange = (e) => {
    const text = e.target.value;
    setName(text.replace(/ /g, ""));
  };

  const onNumberChange = (e) => {
    const text = e.target.value;
    setNumber(text.replace(/ /g, ""));
  };

  return (
    <div className={styles.SelectContainer}>
      <div className={styles.SelectTitleBody}>
        <div className={styles.SelectTitle}>
          <div className={styles.SelectTitleFont}>회원선택</div>
        </div>
        <div className={styles.Search}>
          <div className={styles.SearchBody}>
            <Searchbox
              type="text"
              placeholder="회원성함"
              onChange={onNameChange}
            />
            <Searchbox
              type="text"
              placeholder="관리번호"
              onChange={onNumberChange}
            />
          </div>
        </div>
        <div className={styles.CategoryBody}>
          <div className={styles.CategoryBody1}>
            <div className={styles.CategoryFont}>회원번호</div>
          </div>
          <div className={styles.CategoryBody1}>
            <div className={styles.CategoryFont}>성명</div>
          </div>
          <div className={styles.CategoryBody1}>
            <div className={styles.CategoryFont}>동호번호</div>
          </div>
        </div>
        <div className={styles.Line}></div>
        <SearchList name={name} number={number} />
        <div className={styles.Line}></div>
      </div>
    </div>
  );
}

export default withAuth(Inputmoneysearch);
