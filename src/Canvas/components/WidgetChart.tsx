import React, { useEffect } from "react";

import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import ReactECharts from "echarts-for-react";
import AutoSizer from "react-virtualized-auto-sizer";
import { v4 as uuidv4 } from "uuid";

import { Card } from "antd";
import { WidgetListData } from "../utils/type";

import { ItemTypes } from "./GroupItem";
import * as UI from "../styledComponents";

interface WidgetListProps {
  data: WidgetListData;
}

interface WidgetCategory {
  width: number;
  height: number;
  currentSizeIndex: number;
  sizes: { width: number; height: number }[];
}

const PIE = {
  width: 1,
  height: 4,
  currentSizeIndex: 0,
  sizes: [
    {
      width: 1,
      height: 4,
    },
    {
      width: 2,
      height: 6,
    },
    {
      width: 4,
      height: 9,
    },
  ],
};

const ChartConfig: { [key: string]: WidgetCategory } = {
  pie: PIE,
};

// @ts-ignore
const PieChart = (props) => {
  const option = {
    tooltip: {
      trigger: "item",
      position: ["50%", "50%"],
    },
    series: [
      {
        name: "Access From",
        type: "pie",
        radius: ["40%", "70%"],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: "center",
        },
        labelLine: {
          show: false,
        },
        data: props.data,
      },
    ],
  };
  console.log("pie: ", props.style);
  return (
    <ReactECharts
      {...{
        style: {
          ...props.style,
        },
      }}
      opts={{ renderer: "svg" }}
      option={option}
    />
  );
};

export const DraggableChart: React.FC<WidgetListProps> = ({ data }) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.CARD,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    item: () => {
      const dragCard = {
        ...data,
        id: data.id + uuidv4(),
        type: ItemTypes.CARD,
        isShadow: true,
        ...(data.chartType ? ChartConfig[data.chartType] : []),
      };
      return dragCard;
    },
  });

  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
    >
      <div style={{ margin: "7px", height: "165px", width: "200px" }}>
        <WidgetChart data={data} />
      </div>
    </div>
  );
};

export const WidgetChart: React.FC<WidgetListProps> = ({ data }) => {
  const chartData = [
    { value: 1048, name: "Search Engine" },
    { value: 735, name: "Direct" },
    { value: 580, name: "Email" },
    { value: 484, name: "Union Ads" },
    { value: 300, name: "Video Ads" },
  ];
  return (
    <UI.CardWrapper>
      <Card key={data.id} title={data.title || "Chart"}>
        <AutoSizer>
          {({ height, width }) => {
            console.log("height", height, "width", width);
            return <PieChart style={{ width, height }} data={chartData} />;
          }}
        </AutoSizer>
      </Card>
    </UI.CardWrapper>
  );
};
