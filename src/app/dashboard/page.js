import styles from "../../styles/Dashboard.module.scss";
import dash1 from "../../img/dash1.png";
import dash2 from "../../img/dash2.png";
import dash3 from "../../img/dash3.png";
import dash4 from "../../img/dash4.png";
import up from "../../img/up.png";
import calendar from "../../img/calendar.png";
import { BsBagDash } from "react-icons/bs";
import { BiGroup } from "react-icons/bi";
import { BsDatabase } from "react-icons/bs";
import { BiCalendar } from "react-icons/bi";
import { AiFillCaretUp } from "react-icons/ai";

const Dashboard = () =>{
    return (
      <div className={styles.container}>
        <div className={styles.MainTitle}>
          <div className={styles.ContractBody}>
            <div className={styles.Contract}>

              <div className={styles.ContractSum}>
                <div className={styles.ContractValue}>
                  <div className={styles.ContractIcons}>
                    <div className={styles.ContractImg} style = {{color:'#7152F3'}}>
                      <BsBagDash style={{ width: '100%', height: '100%' }} />
                    </div>
                  </div>
                  <div className={styles.ContractName}>총 계약건수</div>
                </div>
                <div className={styles.ContractValue2}>
                  <div className={styles.ContractVal1}>
                    <div className={styles.Value}>1028</div>
                  </div>
                  <div className={styles.ContractVal2}>
                    <div className={styles.Percentage_G}>
                      <div className={styles.UpImg} style = {{color:'#30BE82'}}>
                        <AiFillCaretUp style={{ width: '100%', height: '100%' }} />
                      </div>
                      <div className={styles.UpText}>
                        12%
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.Bottominfo}>
                  <div className={styles.BottomDate}>
                    업데이트 : 2023년 12월 28일
                  </div>
                </div>
              </div> 
              {/* 덩어리 하나 */}
            
              <div className={styles.ContractSum}>
                <div className={styles.ContractValue}>
                  <div className={styles.ContractIcons}>
                    <div className={styles.ContractImg} style = {{color:'#7152F3'}}>
                      <BiGroup style={{ width: '100%', height: '100%' }} />
                    </div>
                  </div>
                  <div className={styles.ContractName}>완료인원</div>
                </div>
                <div className={styles.ContractValue2}>
                  <div className={styles.ContractVal1}>
                    <div className={styles.Value}>390</div>
                  </div>
                  <div className={styles.ContractVal2}>
                    <div className={styles.Percentage_G}>
                      <div className={styles.UpImg} style = {{color:'#30BE82'}}>
                        <AiFillCaretUp style={{ width: '100%', height: '100%' }} />
                      </div>
                      <div className={styles.UpText}>
                        5%
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles.Bottominfo}>
                  <div className={styles.BottomDate}>
                    업데이트 : 2023년 12월 28일
                  </div>
                </div>
              </div> 
              {/* 덩어리 하나 */}

            </div>
            <div className={styles.Contract}>
              <div className={styles.ContractSum}>
                <div className={styles.ContractValue}>
                  <div className={styles.ContractIcons}>
                    <div className={styles.ContractImg} style = {{color:'#7152F3'}}>
                      <BsDatabase style={{ width: '100%', height: '100%' }} />
                    </div>
                  </div>
                  <div className={styles.ContractName}>계약금액</div>
                </div>
                <div className={styles.ContractValue2}>
                  <div className={styles.ContractVal}>
                    <div className={styles.Value}>12,390,000,000 ₩</div>
                  </div>
                </div>
                <div className={styles.Bottominfo}>
                  <div className={styles.BottomDate}>
                    업데이트 : 2023년 12월 28일
                  </div>
                </div>
              </div> 
              {/* 덩어리 하나 */}

              <div className={styles.ContractSum}>
                <div className={styles.ContractValue}>
                  <div className={styles.ContractIcons}>
                    <div className={styles.ContractImg} style = {{color:'#7152F3'}}>
                      <BsDatabase style={{ width: '100%', height: '100%' }} />
                    </div>
                  </div>
                  <div className={styles.ContractName}>확입금액</div>
                </div>
                <div className={styles.ContractValue2}>
                  <div className={styles.ContractVal}>
                    <div className={styles.Value}>8,990,000,000 ₩</div>
                  </div>
                </div>
                <div className={styles.Bottominfo}>
                  <div className={styles.BottomDate}>
                    업데이트 : 2023년 12월 28일
                  </div>
                </div>
              </div> 
              {/* 덩어리 하나 */}

            </div>


            
            <div className={styles.Client}>
              <div className={styles.ClientBody}>
                <div className={styles.ClientContents}>
                  <div className={styles.ClientTitle}>
                    <div className={styles.ClientTitle1}>
                      <div className={styles.Titlefont}>
                        미납자 명단
                      </div>
                    </div>
                    <div className={styles.ClientTitle2}>
                      <div className={styles.InfoBotton}>
                        <div className={styles.Bottonfont}>정보입력</div>
                      </div>
                    </div>
                  </div>

                  <div className={styles.ClientCategory}>
                    <div className={styles.Number}>
                      <div className={styles.Categoryfont}>
                        관리번호
                      </div>
                    </div>
                    <div className={styles.Name}>
                      <div className={styles.Categoryfont}>
                        성명
                      </div>
                    </div>
                    <div className={styles.Cha}>
                      <div className={styles.Categoryfont}>
                        최종납부
                      </div>
                    </div>
                    <div className={styles.Dong}>
                      <div className={styles.Categoryfont}>
                        임시동호
                      </div>
                    </div>
                  </div>


                  <div className={styles.ClientValue}>
                    <div className={styles.Number}>
                      <div className={styles.Valuefont}>
                        123455
                      </div>
                    </div>
                    <div className={styles.Name}>
                      <div className={styles.Valuefont}>
                        이승준
                      </div>
                    </div>
                    <div className={styles.Cha}>
                      <div className={styles.Valuefont}>
                        4차
                      </div>
                    </div>
                    <div className={styles.Dong}>
                      <div className={styles.Valuefont}>
                        84A-사-1
                      </div>
                    </div>
                  </div>
                  {/* 덩어리 하나 */}

                  <div className={styles.ClientValue}>
                    <div className={styles.Number}>
                      <div className={styles.Valuefont}>
                        123455
                      </div>
                    </div>
                    <div className={styles.Name}>
                      <div className={styles.Valuefont}>
                        이승준
                      </div>
                    </div>
                    <div className={styles.Cha}>
                      <div className={styles.Valuefont}>
                        4차
                      </div>
                    </div>
                    <div className={styles.Dong}>
                      <div className={styles.Valuefont}>
                        84A-사-1
                      </div>
                    </div>
                  </div>
                  {/* 덩어리 하나 */}

                  <div className={styles.ClientValue}>
                    <div className={styles.Number}>
                      <div className={styles.Valuefont}>
                        123455
                      </div>
                    </div>
                    <div className={styles.Name}>
                      <div className={styles.Valuefont}>
                        이승준
                      </div>
                    </div>
                    <div className={styles.Cha}>
                      <div className={styles.Valuefont}>
                        4차
                      </div>
                    </div>
                    <div className={styles.Dong}>
                      <div className={styles.Valuefont}>
                        84A-사-1
                      </div>
                    </div>
                  </div>
                  {/* 덩어리 하나 */}

                  <div className={styles.ClientValue}>
                    <div className={styles.Number}>
                      <div className={styles.Valuefont}>
                        123455
                      </div>
                    </div>
                    <div className={styles.Name}>
                      <div className={styles.Valuefont}>
                        이승준
                      </div>
                    </div>
                    <div className={styles.Cha}>
                      <div className={styles.Valuefont}>
                        4차
                      </div>
                    </div>
                    <div className={styles.Dong}>
                      <div className={styles.Valuefont}>
                        84A-사-1
                      </div>
                    </div>
                  </div>
                  {/* 덩어리 하나 */}

                  <div className={styles.ClientValue}>
                    <div className={styles.Number}>
                      <div className={styles.Valuefont}>
                        123455
                      </div>
                    </div>
                    <div className={styles.Name}>
                      <div className={styles.Valuefont}>
                        이승준
                      </div>
                    </div>
                    <div className={styles.Cha}>
                      <div className={styles.Valuefont}>
                        4차
                      </div>
                    </div>
                    <div className={styles.Dong}>
                      <div className={styles.Valuefont}>
                        84A-사-1
                      </div>
                    </div>
                  </div>
                  {/* 덩어리 하나 */}

                  <div className={styles.ClientValue}>
                    <div className={styles.Number}>
                      <div className={styles.Valuefont}>
                        123455
                      </div>
                    </div>
                    <div className={styles.Name}>
                      <div className={styles.Valuefont}>
                        이승준
                      </div>
                    </div>
                    <div className={styles.Cha}>
                      <div className={styles.Valuefont}>
                        4차
                      </div>
                    </div>
                    <div className={styles.Dong}>
                      <div className={styles.Valuefont}>
                        84A-사-1
                      </div>
                    </div>
                  </div>
                  {/* 덩어리 하나 */}

                  <div className={styles.ClientValue}>
                    <div className={styles.Number}>
                      <div className={styles.Valuefont}>
                        123455
                      </div>
                    </div>
                    <div className={styles.Name}>
                      <div className={styles.Valuefont}>
                        이승준
                      </div>
                    </div>
                    <div className={styles.Cha}>
                      <div className={styles.Valuefont}>
                        4차
                      </div>
                    </div>
                    <div className={styles.Dong}>
                      <div className={styles.Valuefont}>
                        84A-사-1
                      </div>
                    </div>
                  </div>
                  {/* 덩어리 하나 */}


                </div>
              </div>
            </div>


          </div>
          <div className={styles.Date}>
            <div className={styles.DateTitle}>
              <div className={styles.DateTitle1}>
                <div className={styles.DateTitleName}>일정관리</div>
              </div>
              <div className={styles.DateTitle2}>
                <div className={styles.DateIcon}>
                  <div className={styles.CalendarImg} style = {{color:'#7152F3'}}>
                      <BiCalendar style={{ width: '100%', height: '100%' }} />
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.Calendar}></div>
            <div className={styles.Line}></div>
            <div className={styles.Today}>
              <div className={styles.TodayTitle}>
                <div className={styles.TodayTitle1}>
                  <div className={styles.TodayTitleName}>오늘의 일정</div>
                </div>
                <div className={styles.TodayTitle2}></div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.Notice}>
          <div className={styles.NoticeTitle}>
            <div className={styles.NoticeTitle1}>
              <div className={styles.NoticeName}>공지사항</div>
            </div>
            <div className={styles.NoticeTitle2}>
              <div className={styles.NoticeBotton}>
                <div className={styles.NoticeBottonFont}>View All</div>
              </div>
            </div>
          </div>
          <div className={styles.NoticeCategory}>
            <div className={styles.NoticeCategory1}>
              <div className={styles.NoticeCategoryFont}>제목</div>
            </div>
            <div className={styles.NoticeCategory2}>
              <div className={styles.NoticeCategoryFont}>작성자</div>
            </div>
            <div className={styles.NoticeCategory3}>
              <div className={styles.NoticeCategoryFont}>사항</div>
            </div>
            <div className={styles.NoticeCategory4}>
              <div className={styles.NoticeCategoryFont}>작성일자</div>
            </div>
            <div className={styles.NoticeCategory5}>
              <div className={styles.NoticeCategoryFont}>상태</div>
            </div>
          </div>

          <div className={styles.NoticeContent}>
            <div className={styles.NoticeCategory1}>
              <div className={styles.NoticeContentFont}>사이트 개설 안내</div>
            </div>
            <div className={styles.NoticeCategory2}>
              <div className={styles.NoticeContentFont}>오준서</div>
            </div>
            <div className={styles.NoticeCategory3}>
              <div className={styles.NoticeContentFont}>일반</div>
            </div>
            <div className={styles.NoticeCategory4}>
              <div className={styles.NoticeContentFont}>23-12-28 09:27 AM</div>
            </div>
            <div className={styles.NoticeCategory5}>
              <div className={styles.ContentState_G}>
                <div className={styles.G_Font}>해결됨</div>
              </div>
            </div>
          </div>
          {/* 내용 한 덩어리 */}

          <div className={styles.NoticeContent}>
            <div className={styles.NoticeCategory1}>
              <div className={styles.NoticeContentFont}>[긴급] 시스템 점검 안내 (12/29 8Am 부터)</div>
            </div>
            <div className={styles.NoticeCategory2}>
              <div className={styles.NoticeContentFont}>오준서</div>
            </div>
            <div className={styles.NoticeCategory3}>
              <div className={styles.NoticeContentFont}>긴급</div>
            </div>
            <div className={styles.NoticeCategory4}>
              <div className={styles.NoticeContentFont}>23-12-28 09:27 AM</div>
            </div>
            <div className={styles.NoticeCategory5}>
              <div className={styles.ContentState_B}>
                <div className={styles.B_Font}>진행중</div>
              </div>
            </div>
          </div>
          {/* 내용 한 덩어리 */}
          

        </div>
      </div>
      );
  };

export default Dashboard;