"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import LoadingScreen from "@/components/Loading";
import SideBar from "@/components/SideBar";
import Image from "next/image";
import ProgressCircle from "@/components/ProgressCircle";

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!Cookies.get("accessToken")) {
      router.push("/");
    }
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setProgress(75); // SVG 요소가 DOM에 추가된 후 호출
    }
  }, [isLoading]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  function setProgress(percent: number) {
    const circle = document.querySelector(
      ".progress-ring__circle"
    ) as SVGCircleElement | null;
    if (circle) {
      const radius = circle.r.baseVal.value;
      const circumference = radius * 2 * Math.PI;

      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      circle.style.strokeDashoffset = circumference.toString();

      const offset = circumference - (percent / 100) * circumference;
      circle.style.strokeDashoffset = offset.toString();
    }
  }

  return (
    <aside>
      <SideBar />
      <main className="w-full h-[calc(100vh-51px)] lg:h-screen bg-[#F1F5F9]">
        <div className="w-[343px] sm:w-[637px] 2xl:w-[1200px] p-[24px] mx-auto">
          <h2 className="mb-[12px] text-[1.8rem] font-semibold">대시보드</h2>
          <div className="flex flex-col sm:flex-row 2xl:flex-row gap-[24px]">
            <div className="w-[306px] md:w-[306px] 2xl:w-[588px] h-[250px] px-[24px] py-[16px] flex flex-col gap-[16px] rounded-[12px] bg-white">
              <div className="flex items-center gap-[8px]">
                <div className="w-[40px] h-[40px] bg-[#3B82F6] rounded-[15px] flex justify-center items-center">
                  <Image
                    src="/dashboard-recent.svg"
                    width={16}
                    height={16}
                    alt="recent-task-icon"
                  />
                </div>
                <h2 className="text-[1.8rem] font-semibold">
                  최근 등록한 할 일
                </h2>
              </div>
              <div>할 일 목록 들어갈 곳</div>
            </div>
            <div className="w-[306px] 2xl:w-[588px] h-[250px] px-[24px] py-[16px] flex flex-col gap-[16px] rounded-[12px] bg-[#3B82F6] text-white relative">
              <Image
                src="/dashboard-progress.png"
                width={40}
                height={40}
                alt="pregress-task-icon"
              />
              <div>
                <h2>내 진행 상황</h2>
                <span>{}%</span>
              </div>
              <ProgressCircle />
              <Image
                className="absolute right-0 bottom-0"
                src="/bg-outter.svg"
                width={166}
                height={166}
                alt="bg-outter"
              />
            </div>
          </div>
          <div className="w-[306px] sm:w-auto h-full mt-[24px] px-[24px] py-[16px] flex flex-col gap-[16px] rounded-[12px] bg-white">
            <div className="flex items-center gap-[8px]">
              <div className="w-[40px] h-[40px] bg-[#F97316] rounded-[15px] flex justify-center items-center">
                <Image
                  src="/dashboard-flag.svg"
                  width={24}
                  height={24}
                  alt="recent-task-icon"
                />
              </div>
              <h2 className="text-[1.8rem] font-semibold">목표 별 할 일</h2>
            </div>
            <div>목표 별 할 일 들어갈 곳</div>
          </div>
        </div>
      </main>
    </aside>
  );
}
