import { Modal } from "antd";
import { motion } from "framer-motion";
import React, { FunctionComponent } from "react";

type Props = {
  open: boolean;
  setIsAddTodoModalOpen: (open: boolean) => void;
};

const AddTodoForm = ({}) => {
  // const handleOk = async () => {
  //   setIsAddTodoModalOpen(false);
  // };

  return (
    <motion.form
      layout
      key='add-todo-form'
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
        justifyContent: "center",
        height: "100%",
      }}>
      <input type='text' placeholder='Title' />
      <input type='text' placeholder='Add a todo...' />
    </motion.form>
  );
};

export default AddTodoForm;
