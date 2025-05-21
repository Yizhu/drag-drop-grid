import React, { Dispatch, SetStateAction, useEffect } from "react";

import { useDrop, XYCoord } from "react-dnd";

import { CardInfo, Group, LayoutConfig } from "../Canvas";
import utils from "../utils";

import Card from "./Card";

export const ItemTypes = {
  CARD: "card",
};

export interface GroupProps {
  key: string;
  id: string;
  type: string;
  index: number;
  cards: CardInfo[];
  length: number;
  groups: Group[];
  layout: LayoutConfig;
  defaultLayout: LayoutConfig;
  shadowCard: CardInfo;
  moveCardInGroupItem: (hoverItem: GroupProps, x: number, y: number) => void;
  onCardDropInGroupItem: () => void;
  updateShadowCard: Dispatch<SetStateAction<CardInfo>>;
  updateGroupList: Dispatch<SetStateAction<Group[]>>;
  handleLoad: () => void;
  deleteCard: (id: string, groupIndex: number) => void;
}

export default function GroupItem(props: GroupProps) {
  const defaultLayout = props.layout;
  const { id, cards, index, groups, layout, handleLoad, moveCardInGroupItem } =
    props;

  useEffect(() => {
    let clientWidth;
    const containerDom = document.querySelector("#card-container");
    if (containerDom) {
      clientWidth = containerDom.clientWidth;
    }
    if (layout.containerWidth !== clientWidth) {
      handleLoad();
    }
    // eslint-disable-next-line
  }, [layout]);

  const containerHeight = utils.getContainerMaxHeight(
    cards,
    layout.rowHeight,
    layout.margin
  );

  const dropCard = (dragItem: CardInfo, dropItem: GroupProps) => {
    if (dragItem.type === ItemTypes.CARD) {
      props.onCardDropInGroupItem();
      return dropItem;
    }
    return;
  };

  const [, dropRef] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item: CardInfo) => {
      const dragItem = item;
      const dropItem = props;
      dropCard(dragItem, dropItem);
    },
    hover: (item: CardInfo, monitor) => {
      const dragItem = item;
      if (dragItem.type === ItemTypes.CARD) {
        if (props.shadowCard.id !== dragItem.id) {
          props.updateShadowCard(dragItem);
          return;
        }
        // Dragging card to group
        const hoverItem = props;
        const cor = monitor.getClientOffset() as XYCoord;
        const containerDom = document.getElementById("group" + hoverItem.id);
        const groupItemBoundingRect = containerDom?.getBoundingClientRect();
        const groupItemX = groupItemBoundingRect?.left;
        const groupItemY = groupItemBoundingRect?.top;
        moveCardInGroupItem(
          hoverItem,
          cor.x - (groupItemX || 0),
          cor.y - (groupItemY || 0)
        );
      }
    },
  });

  return (
    <div className="canvas-group-item" ref={dropRef} id={"group" + id}>
      <div
        className="group-item-container"
      >
        <section
          id="card-container"
          style={{
            height:
              containerHeight > defaultLayout.containerHeight
                ? containerHeight
                : defaultLayout.containerHeight,
          }}
        >
          {cards.map((c) => (
            <Card
              key={`${index}_${c.id}`}
              groupIndex={index}
              card={c}
              group={props}
              groups={groups}
              layout={props.layout}
              dropCard={dropCard}
              updateShadowCard={props.updateShadowCard}
              updateGroupList={props.updateGroupList}
              deleteCard={props.deleteCard}
            />
          ))}
        </section>
      </div>
    </div>
  );
}
