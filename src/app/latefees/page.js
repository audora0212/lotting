// pages/latefees/page.js
"use client";

import { useState } from "react";
import SearchForm from "@/components/SearchForm";
import withAuth from "@/utils/hoc/withAuth";
import LateFeeList from "@/components/LateFeeList";

function LateFees() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");

  return (
    <>
      <h3>연체료 조회</h3>
      <SearchForm
        name={name}
        setName={setName}
        number={number}
        setNumber={setNumber}
      />
      <LateFeeList
        name={name}
        number={number}
        linkBase="/latefees/"
      />
    </>
  );
}

export default withAuth(LateFees);
