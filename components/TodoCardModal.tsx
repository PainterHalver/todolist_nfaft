import React, { CSSProperties, FunctionComponent, useEffect, useRef } from "react";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { Button, Card, message, Popconfirm, Switch, Typography } from "antd";
import { deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

import { useAppDispatch, useAppSelector } from "../redux/store";
import { selectCurrentTodo, selectCurrentTodoId, registerCurrentTodo } from "../redux/todoSlice";
import db from "../lib/firebase";

const styles: { [key: string]: CSSProperties | { [key: string]: CSSProperties } } = {
  modalContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
  },
  overlay: {
    zIndex: 1,
    position: "fixed",
    background: "rgba(0, 0, 0, 0.2)",
    willChange: "opacity",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  cardContainer: {
    width: "100%",
    borderRadius: "5px",
    maxWidth: "700px",
    zIndex: 2,
  },
  card: {
    backgroundColor: "#ffffff",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};

const TodoCard: FunctionComponent = () => {
  const router = useRouter();
  const { title, note, completed, updatedAt } = useAppSelector(selectCurrentTodo);
  const id = useAppSelector(selectCurrentTodoId);
  const dispatch = useAppDispatch();

  const titleRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);

  const toggleCompleted = async () => {
    try {
      dispatch(
        registerCurrentTodo({
          id,
          todo: { title, note, completed: !completed, updatedAt },
        })
      );
      await updateDoc(doc(db, "todos", id), {
        completed: !completed,
      });
    } catch (error) {
      console.log("Error trying to complete todo: ", error);
    }
  };

  const destroy = async () => {
    try {
      backToHome();
      await deleteDoc(doc(db, "todos", id));
    } catch (error) {
      console.log("Error trying to remove todo: ", error);
    }
  };

  const update = async () => {
    if (!titleRef.current || !noteRef.current) return;

    const title = titleRef.current.textContent || "";
    const note = noteRef.current.textContent || "";

    message.loading({ content: "Updating...", key: "update", duration: 60 });
    try {
      // FIXME: The card layout is duplicated when updating the first todo at index 0.

      const timestamp = serverTimestamp();
      const todoRef = doc(db, "todos", id);
      await updateDoc(todoRef, {
        title,
        note,
        updatedAt: timestamp,
      });
      message.success({ content: "Updated!", key: "update" });
      dispatch(registerCurrentTodo({ id, todo: { title, note, completed, updatedAt: new Date().toISOString() } }));
    } catch (error) {
      console.log("Error trying to update todo: ", error);
      message.error({ content: "Error trying to update todo", key: "update" });
    }
  };

  const backToHome = () => {
    router.push("/");
  };

  return (
    <div style={styles.modalContainer}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        style={styles.overlay}
        onClick={backToHome}></motion.div>
      <motion.div
        drag
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        layoutId={`card-container-${id}`}
        style={styles.cardContainer}>
        <Card
          title={
            <Title completed={completed} title={title} titleRef={titleRef} id={id} toggleCompleted={toggleCompleted} />
          }
          bordered={false}
          style={{ ...styles.card, opacity: completed ? 0.6 : 1 }}>
          <motion.div layoutId={`card-note-${id}`} contentEditable ref={noteRef} suppressContentEditableWarning={true}>
            {note}
          </motion.div>
          <div style={{ marginTop: "1rem", display: "flex", justifyContent: "start", alignItems: "center" }}>
            <motion.div layoutId={`card-updatedAt-${id}`} style={{ marginRight: "auto" }}>
              <Typography style={{ opacity: 0.6, display: "inline" }}>{updatedAt && updatedAt}</Typography>
            </motion.div>
            <motion.div>
              <Popconfirm
                title='Are you sure to delete this todo?'
                onConfirm={() => setTimeout(destroy, 200)}
                okText='Yes'
                icon={<QuestionCircleOutlined style={{ color: "red" }} />}
                cancelText='No'>
                <Button type='primary' danger>
                  Delete
                </Button>
              </Popconfirm>
            </motion.div>
            <motion.div style={{ marginLeft: "1rem" }}>
              <Button type='primary' onClick={update}>
                Update
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

const Title: FunctionComponent<any> = ({ completed, toggleCompleted, title, id, titleRef }) => {
  useEffect(() => {
    // Move cursor to the end of the title
    if (titleRef.current) {
      titleRef.current.focus();
      document.execCommand("selectAll", false, undefined);
      document.getSelection()?.collapseToEnd();
    }
  }, []);

  return (
    <motion.div layoutId={`card-title-${id}`} style={{ display: "flex", alignItems: "center" }}>
      <motion.div layoutId={`card-title-text-${id}`} style={{ flex: 1 }}>
        <div
          contentEditable
          suppressContentEditableWarning={true}
          style={{ whiteSpace: "break-spaces" }}
          ref={titleRef}>
          {title}
        </div>
      </motion.div>
      <motion.div layoutId={`card-switch-${id}`} onClick={(e) => e.stopPropagation()}>
        <Switch
          checked={completed}
          onChange={toggleCompleted}
          style={{ backgroundColor: completed ? "#ff7979" : "#bfbfbf" }}
        />
      </motion.div>
    </motion.div>
  );
};

export default TodoCard;
