import React, { useEffect, useState } from "react";

import _ from "lodash";

import { Button } from "antd";

import Layout from "./components/Layout";
import * as UI from "./styledComponents";

import mockData from './mock'

const compactType = "horizontal";

export interface LayoutConfig {
  containerWidth: number;
  containerHeight: number;
  calWidth: number;
  rowHeight: number;
  col: number;
  margin: number[];
  containerPadding: number[];
}

export interface Size {
  width: number;
  height: number;
}

export interface CardInfo {
  id: string;
  gridx: number;
  gridy: number;
  width: number;
  height: number;
  type: string;
  isShadow: boolean;
  currentSizeIndex: number;
  sizes: Size[];
  chartType?: string;
}
export interface Group {
  id: string;
  sectionId: string;
  type: string;
  cards: CardInfo[];
  index?: number;
  defaultTab?: boolean;
  tabValue?: string;
  tabLabel?: string;
}
export interface Section {
  id: string;
  type: string;
  hasTab: boolean;
  groups: Group[];
}

const layout: LayoutConfig = {
  containerWidth: 1200,
  containerHeight: 300, // min height
  calWidth: 380,
  rowHeight: 50,
  col: 4, // fixed (for R1)
  margin: [20, 10],
  containerPadding: [0, 0], // deprecated
};

const DEFAULT_CANVAS = [
  {
    id: "default_section",
    type: "section",
    hasTab: false,
    groups: [
      {
        id: "default_group",
        sectionId: "default_section",
        type: "group",
        cards: [],
      },
    ],
  },
] as unknown as Section[];

export default function Canvas() {
  const [groups, setGroups] = useState([] as Group[]);
  const [sections, setSections] = useState([] as Section[]);

  useEffect(() => {
    const data = getFromLS();
    setSections(data as Section[]);
    const group = data.reduce(
      //@ts-ignore
      (acc: Section[], cur: Section) => [...acc, ...cur.groups],
      []
    );
    setGroups(group as unknown as Group[]);
  }, []);

  const getFromLS = () => {
    let ls = localStorage.getItem("ui-canvas")
      ? JSON.parse(localStorage.getItem("ui-canvas") || "")
      : mockData; // DEFAULT_CANVAS
    return ls;
  };

  const saveToLS = () => {
    const tmp = _.cloneDeep(sections);
    tmp.forEach((s) => {
      s.groups = groups.filter((g) => g.sectionId === s.id);
    });
    localStorage.setItem("ui-canvas", JSON.stringify(tmp));
  };

  const onClear = () => {
    setSections(DEFAULT_CANVAS);
    setGroups(
      DEFAULT_CANVAS.reduce(
        (acc: Group[], cur: Section) => [...acc, ...cur.groups],
        []
      )
    );
  };

  return (
    <UI.Canvas>
      <div className="header">
        <div className="title">
          <span>Canvas</span>
        </div>
        <div className="actions">
          {/* eslint-disable-next-line */}
          <Button
            type="primary"
            onClick={() => {
              saveToLS();
            }}
          >
            Save
          </Button>
          <Button
            type="primary"
            onClick={() => {
              onClear();
            }}
          >
            Clear
          </Button>
        </div>
      </div>
      <div className="grid" id="grid">
        <UI.Grid>
          <Layout
            sections={sections}
            groups={groups}
            setGroups={setGroups}
            compactType={compactType}
            layout={layout}
          />
        </UI.Grid>
      </div>
    </UI.Canvas>
  );
}
