"use client"

import { Inputbox, Inputbox_L, Inputbox_M, PostInputbox, LongInputbox, DropInputbox, FileInputbox, Spanbox } from "@/components/Inputbox"
import { PaymentScheduleButton, ToggleButton, SearchButton, Button_Y, Button_N } from "@/components/Button"
import styles from "@/styles/chasu.module.scss";
import { useState, useEffect } from "react"; // useEffect와 useState 추가
import { BsDatabase } from "react-icons/bs";
import { CgSearch } from "react-icons/cg";
import { useForm } from 'react-hook-form';

export default function chasu() {
    const { register, watch, handleSubmit } = useForm();

    const onSubmit = (data) => {
        console.log(data);
    };

    const [isElementVisible, setIsElementVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const element = document.getElementById('targetElement'); // targetElement의 ID를 가져옴
            if (element) {
                const elementTop = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                setIsElementVisible(elementTop < windowHeight);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className={styles.Container}>
            <div className={styles.Title}>
                <div className = {styles.TitleFont1}>일반납부일정 확인</div>
                <div className = {styles.TitleFont2}>일반납부일정 정보를 입력합니다.</div>
            </div>
            <div className={styles.MainBody}>
                <div className={styles.MainTop}></div>
                <div className={styles.MainTitle1}>
                    <div className={styles.MainTitle1_head}>
                        <div className={styles.MainTitleFont}>
                            <br />층별 군
                        </div>
                    </div>
                    <div className={styles.MainTitle1_body}>
                        <div className={styles.MainTitleFont}>
                            <br />1차
                        </div>
                    </div>
                    <div className={styles.MainTitle1_body}>
                        <div className={styles.MainTitleFont}>
                            <br />2차
                        </div>
                    </div>
                    <div className={styles.MainTitle1_body}>
                        <div className={styles.MainTitleFont}>
                            <br />3차
                        </div>
                    </div>
                    <div className={styles.MainTitle1_body}>
                        <div className={styles.MainTitleFont}>
                            20%<br />4차
                        </div>
                    </div>
                    <div className={styles.MainTitle1_body}>
                        <div className={styles.MainTitleFont}>
                            15%<br />5차
                        </div>
                    </div>
                    <div className={styles.MainTitle1_body}>
                        <div className={styles.MainTitleFont}>
                            20%<br />6차
                        </div>
                    </div>
                    <div className={styles.MainTitle1_body}>
                        <div className={styles.MainTitleFont}>
                            20%<br />7차
                        </div>
                    </div>
                    <div className={styles.MainTitle1_body}>
                        <div className={styles.MainTitleFont}>
                            15%<br />8차
                        </div>
                    </div>
                    <div className={styles.MainTitle1_body}>
                        <div className={styles.MainTitleFont}>
                            10%<br />9차
                        </div>
                    </div>
                    <div className={styles.MainTitle1_body}>
                        <div className={styles.MainTitleFont}>
                            <br />합계
                        </div>
                    </div>
                    <div className={styles.MainTitle1_body}>
                        <div className={styles.MainTitleFont}>
                            <br />납입비율
                        </div>
                    </div>
                    <div className={styles.MainTitle1_body}>
                        <div className={styles.MainTitleFont}>
                            <br />남은금원
                        </div>
                    </div>
                </div>

                <div className={styles.MainTitle2}>
                    <div className={styles.MainTitle2_head}>
                        <div className={styles.MainTitleFont}>
                            <br />군
                        </div>
                    </div>
                    <div className={styles.MainTitle2_head}>
                        <div className={styles.MainTitleFont}>
                            <br />층
                        </div>
                    </div>
                    <div className={styles.MainTitle2_body}>
                        <div className={styles.MainTitleFont}>
                            <br />가입 시
                        </div>
                    </div>
                    <div className={styles.MainTitle2_body}>
                        <div className={styles.MainTitleFont}>
                            가입 후<br />1개월
                        </div>
                    </div>
                    <div className={styles.MainTitle2_body}>
                        <div className={styles.MainTitleFont}>
                            가입 후<br />2개월
                        </div>
                    </div>
                    <div className={styles.MainTitle2_body}>
                        <div className={styles.MainTitleFont}>
                            협동조합<br />설립 시
                        </div>
                    </div>
                    <div className={styles.MainTitle2_body}>
                        <div className={styles.MainTitleFont}>
                            건축심의<br />접수 시
                        </div>
                    </div>
                    <div className={styles.MainTitle2_body}>
                        <div className={styles.MainTitleFont}>
                            건축심의<br />완료 시
                        </div>
                    </div>
                    <div className={styles.MainTitle2_body}>
                        <div className={styles.MainTitleFont}>
                            사업승인<br />신청 시
                        </div>
                    </div>
                    <div className={styles.MainTitle2_body}>
                        <div className={styles.MainTitleFont}>
                            사업승인<br />완료 시
                        </div>
                    </div>
                    <div className={styles.MainTitle2_body}>
                        <div className={styles.MainTitleFont}>
                            <br />창공 시
                        </div>
                    </div>
                    <div className={styles.MainTitle2_body}>
                        <div className={styles.MainTitleFont}>
                            -<br />
                        </div>
                    </div>
                    <div className={styles.MainTitle2_body}>
                        <div className={styles.MainTitleFont}>
                            -<br />
                        </div>
                    </div>
                    <div className={styles.MainTitle2_body}>
                        <div className={styles.MainTitleFont}>
                            부담금+<br />업무대행비
                        </div>
                    </div>
                </div>

                <div className={styles.ExcelContentsBody}>
                    <div className={styles.ExcelContent_Head}>
                        <div className={styles.ExcelContentFont}>44가</div>
                    </div>
                    <div className={styles.ExcelContent_Head}>
                        <div className={styles.ExcelContentFont}>1~6</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>1,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>9,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>5,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>16,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>12,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>11,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>16,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>7,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>8,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>85,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>40.37%</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>80,000</div>
                    </div>
                </div>
                {/* 한덩어리 */}

                <div className={styles.ExcelContentsBody}>
                    <div className={styles.ExcelContent_Head}>
                        <div className={styles.ExcelContentFont}>44가</div>
                    </div>
                    <div className={styles.ExcelContent_Head}>
                        <div className={styles.ExcelContentFont}>1~6</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>1,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>9,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>5,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>16,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>12,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>11,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>16,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>7,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>8,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>85,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>40.37%</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>80,000</div>
                    </div>
                </div>
                {/* 한덩어리 */}

                <div className={styles.ExcelContentsBody}>
                    <div className={styles.ExcelContent_Head}>
                        <div className={styles.ExcelContentFont}>44가</div>
                    </div>
                    <div className={styles.ExcelContent_Head}>
                        <div className={styles.ExcelContentFont}>1~6</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>1,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>9,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>5,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>16,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>12,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>11,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>16,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>7,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>8,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>85,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>40.37%</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>80,000</div>
                    </div>
                </div>
                {/* 한덩어리 */}

                <div className={styles.ExcelContentsBody}>
                    <div className={styles.ExcelContent_Head}>
                        <div className={styles.ExcelContentFont}>44가</div>
                    </div>
                    <div className={styles.ExcelContent_Head}>
                        <div className={styles.ExcelContentFont}>1~6</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>1,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>9,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>5,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>16,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>12,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>11,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>16,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>7,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>8,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>85,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>40.37%</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>80,000</div>
                    </div>
                </div>
                {/* 한덩어리 */}

                <div className={styles.ExcelContentsBody}>
                    <div className={styles.ExcelContent_Head}>
                        <div className={styles.ExcelContentFont}>44가</div>
                    </div>
                    <div className={styles.ExcelContent_Head}>
                        <div className={styles.ExcelContentFont}>1~6</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>1,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>9,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>5,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>16,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>12,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>11,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>16,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>7,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>8,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>85,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>40.37%</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>80,000</div>
                    </div>
                </div>
                {/* 한덩어리 */}

                <div className={styles.ExcelContentsBody}>
                    <div className={styles.ExcelContent_Head}>
                        <div className={styles.ExcelContentFont}>44가</div>
                    </div>
                    <div className={styles.ExcelContent_Head}>
                        <div className={styles.ExcelContentFont}>1~6</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>1,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>9,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>5,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>16,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>12,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>11,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>16,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>7,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>8,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>85,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>40.37%</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>80,000</div>
                    </div>
                </div>
                {/* 한덩어리 */}

                <div className={styles.ExcelContentsBody}>
                    <div className={styles.ExcelContent_Head}>
                        <div className={styles.ExcelContentFont}>44가</div>
                    </div>
                    <div className={styles.ExcelContent_Head}>
                        <div className={styles.ExcelContentFont}>1~6</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>1,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>9,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>5,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>16,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>12,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>11,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>16,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>7,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>8,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>85,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>40.37%</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>80,000</div>
                    </div>
                </div>
                {/* 한덩어리 */}

                <div className={styles.ExcelContentsBody}>
                    <div className={styles.ExcelContent_Head}>
                        <div className={styles.ExcelContentFont}>44가</div>
                    </div>
                    <div className={styles.ExcelContent_Head}>
                        <div className={styles.ExcelContentFont}>1~6</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>1,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>9,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>5,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>16,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>12,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>11,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>16,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>7,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>8,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>85,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>40.37%</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>80,000</div>
                    </div>
                </div>
                {/* 한덩어리 */}

                <div className={styles.ExcelContentsBody}>
                    <div className={styles.ExcelContent_Head}>
                        <div className={styles.ExcelContentFont}>44가</div>
                    </div>
                    <div className={styles.ExcelContent_Head}>
                        <div className={styles.ExcelContentFont}>1~6</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>1,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>9,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>5,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>16,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>12,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>11,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>16,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>7,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>8,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>85,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>40.37%</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>80,000</div>
                    </div>
                </div>
                {/* 한덩어리 */}

                <div className={styles.ExcelContentsBody}>
                    <div className={styles.ExcelContent_Head}>
                        <div className={styles.ExcelContentFont}>44가</div>
                    </div>
                    <div className={styles.ExcelContent_Head}>
                        <div className={styles.ExcelContentFont}>1~6</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>1,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>9,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>5,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>16,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>12,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>11,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>16,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>7,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>8,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>85,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>40.37%</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>80,000</div>
                    </div>
                </div>
                {/* 한덩어리 */}

                <div className={styles.ExcelContentsBody}>
                    <div className={styles.ExcelContent_Head}>
                        <div className={styles.ExcelContentFont}>44가</div>
                    </div>
                    <div className={styles.ExcelContent_Head}>
                        <div className={styles.ExcelContentFont}>1~6</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>1,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>9,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>5,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>16,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>12,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>11,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>16,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>7,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>8,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>85,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>40.37%</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>80,000</div>
                    </div>
                </div>
                {/* 한덩어리 */}

                <div className={styles.ExcelContentsBody}>
                    <div className={styles.ExcelContent_Head}>
                        <div className={styles.ExcelContentFont}>44가</div>
                    </div>
                    <div className={styles.ExcelContent_Head}>
                        <div className={styles.ExcelContentFont}>1~6</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>1,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>9,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>5,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>16,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>12,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>11,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>16,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>7,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>8,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>85,000</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>40.37%</div>
                    </div>
                    <div className={styles.ExcelContent_Body}>
                        <div className={styles.ExcelContentFont}>80,000</div>
                    </div>
                </div>
                {/* 한덩어리 */}

                
            </div>
        </div>
    );
};
