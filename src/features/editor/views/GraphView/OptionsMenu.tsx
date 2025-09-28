import React from "react";
import { ActionIcon, Flex } from "@mantine/core";
import { useHotkeys } from "@mantine/hooks";
import styled from "styled-components";
import { event as gaEvent } from "nextjs-google-analytics";
import { AiTwotoneEdit } from "react-icons/ai";
import { LuImageDown } from "react-icons/lu";
import { TiFlowMerge } from "react-icons/ti";
import { FileFormat } from "../../../../enums/file.enum";
import useFile from "../../../../store/useFile";
import useJson from "../../../../store/useJson";
import { useModal } from "../../../../store/useModal";
import type { LayoutDirection } from "../../../../types/graph";
import useGraph from "./stores/useGraph";

const StyledFlowIcon = styled(TiFlowMerge)<{ rotate: number }>`
  transform: rotate(${({ rotate }) => `${rotate}deg`});
`;

const getNextDirection = (direction: LayoutDirection) => {
  if (direction === "RIGHT") return "DOWN";
  if (direction === "DOWN") return "LEFT";
  if (direction === "LEFT") return "UP";
  return "RIGHT";
};

const rotateLayout = (direction: LayoutDirection) => {
  if (direction === "LEFT") return 90;
  if (direction === "UP") return 180;
  if (direction === "RIGHT") return 270;
  return 360;
};

export const OptionsMenu = () => {
  const setDirection = useGraph(state => state.setDirection);
  const direction = useGraph(state => state.direction);
  const setVisible = useModal(state => state.setVisible);
  const getJson = useJson(state => state.getJson);
  const setContents = useFile(state => state.setContents);

  const toggleDirection = () => {
    const nextDirection = getNextDirection(direction || "RIGHT");
    if (setDirection) setDirection(nextDirection);
  };

  useHotkeys(
    [
      ["mod+shift+d", toggleDirection],
      [
        "mod+f",
        () => {
          const input = document.querySelector("#search-node") as HTMLInputElement;
          input.focus();
        },
      ],
    ],
    []
  );

  async function requestLLM() {
    try {
      const json = getJson();

      const response = await fetch("http://172.21.3.56:5000/tools/json_fix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ json_input: json, stream: false }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 一次性获取完整 JSON
      const result = await response.json();
      setContents({ contents: JSON.stringify(result, null, 2), format: FileFormat.JSON });
    } catch (error) {
      console.error("请求LLM失败:", error);
    }
  }

  return (
    <Flex
      gap="xs"
      align="center"
      direction={"column"}
      style={{
        position: "absolute",
        top: "10px",
        left: "10px",
        zIndex: 100,
      }}
    >
      <ActionIcon
        aria-label="ask-llm"
        size="lg"
        color="teal"
        variant="light"
        onClick={() => {
          requestLLM();
          gaEvent("request_llm", { label: "ask" });
        }}
      >
        <AiTwotoneEdit size={18} />
      </ActionIcon>
      <ActionIcon
        aria-label="download"
        size="lg"
        color="blue"
        variant="light"
        onClick={() => setVisible("DownloadModal", true)}
      >
        <LuImageDown size={18} />
      </ActionIcon>

      <ActionIcon
        aria-label="rotate layout"
        size="lg"
        color="gray"
        variant="light"
        onClick={() => {
          toggleDirection();
          gaEvent("rotate_layout", { label: direction });
        }}
      >
        <StyledFlowIcon rotate={rotateLayout(direction || "RIGHT")} />
      </ActionIcon>
    </Flex>
  );
};
