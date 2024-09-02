"use client"

import { Inputbox,PostInputbox,LongInputbox,DropInputbox,FileInputbox } from "@/components/Inputbox"
import styles from "@/app/Home.module.scss"

const testlist = [{
  "value" : "여기에 벨류를 입력하세요",
  "item" : "여기에 아이템을 입력하세요"
}]

export default function Home() {
  const handleChange = e => {
    console.log(e.target.value)
  }

  return (
      <div >
        <h1>123</h1>
        <div className={styles.container}>
          <PostInputbox />
          <FileInputbox />
          <Inputbox type="text" placeholder="이름" onChange={handleChange} />
          <Inputbox type="date" placeholder="날짜" />
          <Inputbox />
          <Inputbox />
          <LongInputbox />
          <Inputbox />
          <Inputbox />
          <DropInputbox list={testlist}/>

        </div>    
      </div>
    )
}
