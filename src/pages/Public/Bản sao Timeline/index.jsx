import React from "react";
import { Circle, ArrowRight } from "lucide-react";
import "./Timeline.css";

import { defaultHistorys } from "../../../data/historyData";

  export default function Timeline() {
    return (
      <div className="w-full mx-auto py-10 px-7 h-full">
        <div className="h-16"></div>
        <h2 className="text-3xl font-bold text-center mb-8">
          Lịch sử cập nhật
        </h2>
        <div className="relative pl-6">
          {/* Đường dọc */}
          <div className="absolute left-3 bottom-0 w-1 animate-expand h-full bg-primary">
          <div className="absolute z-10 top-0 -ml-1 -mt-1.5 border-l-8 border-r-8 border-b-8 border-transparent"
              style={{
                width: "0",
                height: "0",
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderBottom: "8px solid currentColor",
                color: "var(--primary)"
              }}></div>
          </div>
  
          {defaultHistorys.map((update, index) => (
            <div
              key={index}
              className="relative flex items-start space-x-4 pt-5 animate-zoomIn "
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Chấm tròn có hiệu ứng "pulse" */}
              <div
                className="relative z-10 bg-primary rounded-full animate-pulseEffect mt-4 animate-pulseWave"
                style={{ animationDelay: `${index * 0.1 + 0.2}s` }}
              >
                <Circle size={14} className="text-white" />
              </div>
              {/* Nội dung */}
              <div className="relative bg-base-100 border-base-300 text-base-content p-4 rounded-lg shadow-md w-full animate-slideUp">
              {/* Tam giác cạnh trái */}
              <div className="absolute top-4 -left-2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent"></div>
                
                <span className="absolute underline font-semibold text-blue z-10 top-1 right-2 text-md text-base-content">
                  {update.date}
                </span>
                <span className="absolute bottom-1 right-2 font-lovehouse">
                  Dio
                </span>
                <h3 className="flex flex-row items-center text-lg font-semibold py-2">
                  {update.title}
                </h3>
                <div className="flex items-center justify-start pb-2">
                  <span className="arrow-animate">
                    <ArrowRight size={22} className="text-green-500 mr-2 mt-2" />
                  </span>
                  <p className="flex flex-row items-center whitespace-pre-line">
                    {update.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
