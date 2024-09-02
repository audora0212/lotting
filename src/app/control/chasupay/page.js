"use client"

import { Inputbox, Inputbox_L, Inputbox_M, PostInputbox, LongInputbox, DropInputbox, FileInputbox, Spanbox } from "@/components/Inputbox"
import { PaymentScheduleButton, ModifyButton,ChecButton,ToggleButton, SearchButton, Button_Y, Button_N } from "@/components/Button"
import styles from "@/styles/chasupay.module.scss";
import { useState, useEffect } from "react"; // useEffect와 useState 추가
import { BsDatabase } from "react-icons/bs";
import { CgSearch } from "react-icons/cg";
import { useForm } from 'react-hook-form';

export default function chasupay() {
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
            <form onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.Mainbody}>
            <div className={styles.Title}>
                <div className = {styles.TitleFont1}>일반납부일정 확인</div>
                <div className = {styles.TitleFont2}>일반납부일정 정보를 입력합니다.</div>
            </div>
            <div className = {styles.Category}>
                <div className = {styles.Categorybody}>
                    <div className = {styles.CategoryFont}>차수</div>
                </div>
                <div className = {styles.Categorybody}>
                    <div className = {styles.CategoryFont}>생성일</div>
                </div>
                <div className = {styles.Categorybody}>
                    <div className = {styles.CategoryFont}>생성자</div>
                </div>
                <div className = {styles.Categorybody}>
                    <div className = {styles.CategoryFont}>코멘트</div>
                </div>
            </div>
            <div className = {styles.Line}></div>
            <div className = {styles.Category}>
                <div className = {styles.Categorybody}>
                    <div className = {styles.BodyFont}>1-1차</div>
                </div>
                <div className = {styles.Categorybody}>
                    <div className = {styles.BodyFont}>23/12/29</div>
                </div>
                <div className = {styles.Categorybody}>
                    <div className = {styles.BodyFont}>이승준</div>
                </div>
                <div className = {styles.Categorybody}>
                    <div className = {styles.BodyFont}>특이사항 없음</div>
                </div>
                <div className = {styles.Categorybody}></div>
                <div className = {styles.Buttonbody}>
                    <ChecButton>
                        <div className ={styles.ButtonFont}>확인하기</div>
                    </ChecButton>
                </div>
            </div>
            <div className = {styles.Line}></div>

            <div className = {styles.Category}>
                <div className = {styles.Categorybody}>
                    <div className = {styles.BodyFont}>1-1차</div>
                </div>
                <div className = {styles.Categorybody}>
                    <div className = {styles.BodyFont}>23/12/29</div>
                </div>
                <div className = {styles.Categorybody}>
                    <div className = {styles.BodyFont}>이승준</div>
                </div>
                <div className = {styles.Categorybody}>
                    <div className = {styles.BodyFont}>특이사항 없음</div>
                </div>
                <div className = {styles.Categorybody}></div>
                <div className = {styles.Buttonbody}>
                    <ChecButton>
                        <div className ={styles.ButtonFont}>확인하기</div>
                    </ChecButton>
                </div>
            </div>
            <div className = {styles.Line}></div>

            <div className = {styles.Category}>
                <div className = {styles.Categorybody}>
                    <div className = {styles.BodyFont}>1-1차</div>
                </div>
                <div className = {styles.Categorybody}>
                    <div className = {styles.BodyFont}>23/12/29</div>
                </div>
                <div className = {styles.Categorybody}>
                    <div className = {styles.BodyFont}>이승준</div>
                </div>
                <div className = {styles.Categorybody}>
                    <div className = {styles.BodyFont}>특이사항 없음</div>
                </div>
                <div className = {styles.Categorybody}></div>
                <div className = {styles.Buttonbody}>
                    <ChecButton>
                        <div className ={styles.ButtonFont}>확인하기</div>
                    </ChecButton>
                </div>
            </div>
            <div className = {styles.Line}></div>

            <div className = {styles.Category}>
                <div className = {styles.Categorybody}>
                    <div className = {styles.BodyFont}>1-1차</div>
                </div>
                <div className = {styles.Categorybody}>
                    <div className = {styles.BodyFont}>23/12/29</div>
                </div>
                <div className = {styles.Categorybody}>
                    <div className = {styles.BodyFont}>이승준</div>
                </div>
                <div className = {styles.Categorybody}>
                    <div className = {styles.BodyFont}>특이사항 없음</div>
                </div>
                <div className = {styles.Categorybody}></div>
                <div className = {styles.Buttonbody}>
                    <ChecButton>
                        <div className ={styles.ButtonFont}>확인하기</div>
                    </ChecButton>
                </div>
            </div>
            <div className = {styles.Line}></div>

            <div className = {styles.Category}>
                <div className = {styles.Categorybody}>
                    <div className = {styles.BodyFont}>1-1차</div>
                </div>
                <div className = {styles.Categorybody}>
                    <div className = {styles.BodyFont}>23/12/29</div>
                </div>
                <div className = {styles.Categorybody}>
                    <div className = {styles.BodyFont}>이승준</div>
                </div>
                <div className = {styles.Categorybody}>
                    <div className = {styles.BodyFont}>특이사항 없음</div>
                </div>
                <div className = {styles.Categorybody}></div>
                <div className = {styles.Buttonbody}>
                    <ChecButton>
                        <div className ={styles.ButtonFont}>확인하기</div>
                    </ChecButton>
                </div>
            </div>
            <div className = {styles.Line}></div>
            
            </div>
            </form>
        </div>
    );
};
