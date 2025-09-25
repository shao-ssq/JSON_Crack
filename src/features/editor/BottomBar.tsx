import React from "react";
import { Flex, Menu, Text } from "@mantine/core";
import styled from "styled-components";
import { event as gaEvent } from "nextjs-google-analytics";
import { BiSolidDockLeft } from "react-icons/bi";
import { IoMdCheckmark } from "react-icons/io";
import { MdArrowUpward } from "react-icons/md";
import { formats } from "../../enums/file.enum";
import useConfig from "../../store/useConfig";
import useFile from "../../store/useFile";
import { ViewMenu } from "./Toolbar/ViewMenu";

const StyledBottomBar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${({ theme }) => theme.BACKGROUND_MODIFIER_ACCENT};
  background: ${({ theme }) => theme.TOOLBAR_BG};
  max-height: 27px;
  height: 27px;
  z-index: 35;
  padding-right: 6px;

  @media screen and (max-width: 320px) {
    display: none;
  }
`;

const StyledLeft = styled.div`
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 4px;
  padding-left: 8px;

  @media screen and (max-width: 480px) {
    display: none;
  }
`;

const StyledRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: right;
  gap: 4px;
`;

const StyledBottomBarItem = styled.button<{ $bg?: string }>`
  display: flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
  margin: 0;
  height: 28px;
  padding: 4px;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.INTERACTIVE_NORMAL};
  background: ${({ $bg }) => $bg};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;

  &:hover:not(&:disabled) {
    background-image: linear-gradient(rgba(0, 0, 0, 0.1) 0 0);
    color: ${({ theme }) => theme.INTERACTIVE_HOVER};
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;

export const BottomBar = () => {
  const data = useFile(state => state.fileData);
  const liveTransformEnabled = useConfig(state => state.liveTransformEnabled);
  const error = useFile(state => state.error);
  const setContents = useFile(state => state.setContents);
  const setFormat = useFile(state => state.setFormat);
  const currentFormat = useFile(state => state.format);

  const toggleEditor = () => {
    gaEvent("toggle_fullscreen");
  };

  React.useEffect(() => {
    if (data?.name) window.document.title = `${data.name} | JSON Crack`;
  }, [data]);

  return (
    <StyledBottomBar>
      <StyledLeft>
        <StyledBottomBarItem onClick={toggleEditor}>
          <BiSolidDockLeft />
        </StyledBottomBarItem>
        <ViewMenu />
        {!liveTransformEnabled && (
          <StyledBottomBarItem onClick={() => setContents({})} disabled={!!error}>
            Click to Transform
          </StyledBottomBarItem>
        )}
      </StyledLeft>
      <StyledRight>
        <Menu offset={8}>
          <Menu.Target>
            <StyledBottomBarItem>
              <Flex align="center" gap={2}>
                <MdArrowUpward />
                <Text size="xs">{currentFormat?.toUpperCase()}</Text>
              </Flex>
            </StyledBottomBarItem>
          </Menu.Target>
          <Menu.Dropdown>
            {formats.map(format => (
              <Menu.Item
                key={format.value}
                fz={12}
                onClick={() => setFormat(format.value)}
                rightSection={currentFormat === format.value && <IoMdCheckmark />}
              >
                {format.label}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      </StyledRight>
    </StyledBottomBar>
  );
};
