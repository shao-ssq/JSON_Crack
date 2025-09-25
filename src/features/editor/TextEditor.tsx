import React, { useCallback } from "react";
import { LoadingOverlay } from "@mantine/core";
import styled from "styled-components";
import Editor, { type EditorProps, loader, type OnMount, useMonaco } from "@monaco-editor/react";
import useConfig from "../../store/useConfig";
import useFile from "../../store/useFile";

loader.config({
  paths: {
    vs: window.location.origin + "/monaco-editor/min/vs",
  },
});

const editorOptions: EditorProps["options"] = {
  tabSize: 2,
  minimap: { enabled: false },
  stickyScroll: { enabled: false },
  scrollBeyondLastLine: false,
  placeholder: "Start typing...",
  formatOnType: true,
  formatOnPaste: false, // 关闭内部自动格式化，统一在 onDidPaste 处理
};

const TextEditor = () => {
  const monaco = useMonaco();
  const contents = useFile(state => state.contents);
  const setContents = useFile(state => state.setContents);
  const setError = useFile(state => state.setError);
  const jsonSchema = useFile(state => state.jsonSchema);
  const theme = useConfig(state => (state.darkmodeEnabled ? "vs-dark" : "light"));
  const fileType = useFile(state => state.format);

  // 设置 JSON Schema 验证
  React.useEffect(() => {
    if (monaco) {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        allowComments: true,
        enableSchemaRequest: true,
        ...(jsonSchema && {
          schemas: [
            {
              uri: "http://myserver/foo-schema.json",
              fileMatch: ["*"],
              schema: jsonSchema,
            },
          ],
        }),
      });
    }
  }, [jsonSchema, monaco]);

  // Monaco Mount 时配置粘贴行为
  const handleMount: OnMount = useCallback(editor => {
    editor.onDidPaste(() => {
      const model = editor.getModel();
      if (model) {
        let value = model.getValue();

        // 去掉开头的空白、换行、BOM、零宽字符
        value = value.replace(/^[\s\uFEFF\u200B]+/, "");

        model.setValue(value);

        // 格式化整个文档
        editor.getAction("editor.action.formatDocument")?.run();
      }
    });
  }, []);

  return (
    <StyledEditorWrapper>
      <StyledWrapper>
        <Editor
          height="100%"
          language={fileType}
          theme={theme}
          value={contents}
          options={editorOptions}
          onMount={handleMount}
          onValidate={errors => setError(errors[0]?.message || "")}
          onChange={contents => {
            if (typeof contents === "string") {
              // 再次保险去掉开头空白
              contents = contents.replace(/^[\s\uFEFF\u200B]+/, "");
              setContents({ contents, skipUpdate: true });
            }
          }}
          loading={<LoadingOverlay visible />}
        />
      </StyledWrapper>
    </StyledEditorWrapper>
  );
};

export default TextEditor;

const StyledEditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  user-select: none;
`;

const StyledWrapper = styled.div`
  display: grid;
  height: calc(100vh - 27px);
  grid-template-columns: 100%;
  grid-template-rows: minmax(0, 1fr);
`;
