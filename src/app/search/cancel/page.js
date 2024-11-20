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

  const dropdownLists = [typelist, grouplist, turnlist];

  return (
    <>
      <h3>해약</h3>
      <SearchForm
        name={name}
        setName={setName}
        number={number}
        setNumber={setNumber}
        dropdownLists={dropdownLists}
      />
      {typeof window !== "undefined" && (
        <SearchList
          name={name}
          number={number}
          categoryFilter={["x","x1"]}
          linkBase="/search/" 
        />
      )}
    </>
  );
}

export default withAuth(Search);
