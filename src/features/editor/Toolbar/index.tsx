import React from "react";
import { Flex, Group } from "@mantine/core";
import styled from "styled-components";
import { JSONCrackLogo } from "../../../layout/JsonCrackLogo";
import { FileMenu } from "./FileMenu";
import { ViewMenu } from "./ViewMenu";
import { StyledToolElement } from "./styles";

const StyledTools = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  gap: 4px;
  justify-content: space-between;
  height: 40px;
  padding: 4px 8px;
  background: ${({ theme }) => theme.TOOLBAR_BG};
  color: ${({ theme }) => theme.SILVER};
  z-index: 36;
  border-bottom: 1px solid ${({ theme }) => theme.SILVER_DARK};

  @media only screen and (max-width: 320px) {
    display: none;
  }
`;

export const Toolbar = () => {
  return (
    <StyledTools>
      <Group gap="xs" justify="left" w="100%" style={{ flexWrap: "nowrap" }}>
        <StyledToolElement title="JSON Crack">
          <Flex gap="xs" align="center" justify="center">
            <JSONCrackLogo fontSize="0.8rem" hideLogo />
          </Flex>
        </StyledToolElement>
        <FileMenu />
        <ViewMenu />
        {/*<ToolsMenu />*/}
      </Group>
    </StyledTools>
  );
};
