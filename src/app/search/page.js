// pages/search/page.js
"use client";

import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import SearchList from "@/components/SearchList";
import styles from "@/styles/Search.module.scss";
import { typelist, grouplist, turnlist } from "@/components/droplistdata";
import withAuth from "@/utils/hoc/withAuth";

function Search() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");

  return (
    <>
      <h3>회원 검색</h3>
      <SearchForm
        name={name}
        setName={setName}
        number={number}
        setNumber={setNumber}
      />
      {typeof window !== "undefined" && (
        <SearchList
          name={name}
          number={number}
          linkBase="/search/"
        />
      )}
    </>
  );
}

export default withAuth(Search);
