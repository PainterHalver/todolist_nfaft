import {
  addDoc,
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { CSSProperties, FormEvent, FunctionComponent, useEffect, useRef, useState } from "react";
import { Button } from "antd";
import { useDispatch } from "react-redux";
import Head from "next/head";

import TodoCard from "../components/TodoCard";
import TodoCardModal from "../components/TodoCardModal";
import db from "../lib/firebase";
import { useRouter } from "next/router";
import { unregisterCurrentTodo } from "../redux/todoSlice";
import { getAuth } from "firebase/auth";
import { useAppSelector } from "../redux/store";
import { selectUser } from "../redux/authSlice";

const styles: { [key: string]: CSSProperties } = {
  container: {
    maxWidth: "1200px",
    width: "100%",
    alignSelf: "start",

    height: "100%",
    padding: "1rem 1rem",

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  addTodoContainer: {
    backgroundColor: "white",
    color: "black",
    marginBottom: "1.5rem",
    width: "66%",
    minWidth: "450px",
    borderRadius: "3px",
    padding: ".5rem .7rem",
    fontSize: "1rem",
    letterSpacing: "0.00938em",
    height: "-1px", // don't know why this is needed, but it is
    display: "flex",
    flexDirection: "column",
  },
  wrapper: {
    width: "100%",
    height: "100%",
    display: "grid",
    // gridTemplateColumns: "repeat(3, minmax(0, 1fr))", // exact same width
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "2rem",
  },
};

const containerVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { delay: 0.3 } },
  exit: { opacity: 0 },
};

const Home: FunctionComponent = () => {
  const [isAddTodoOpen, setIsAddTodoOpen] = useState(false);
  const addTodoTitle = useRef<HTMLTextAreaElement>(null);
  const addTodoNote = useRef<HTMLTextAreaElement>(null);
  const [todos, setTodos] = useState<DocumentData[]>([]);
  const reduxUser = useAppSelector(selectUser);
  const dispatch = useDispatch();

  const router = useRouter();
  const hash = router.asPath.split("#")[1];

  useEffect(() => {
    resizeTextarea(addTodoTitle.current!);
    dispatch(unregisterCurrentTodo());

    if (hash) {
      router.push("/");
      window.location.reload();
    }

    const user = getAuth().currentUser;
    const unsubscribe = onSnapshot(
      query(
        collection(db, "todos"),
        where("uid", "==", user ? user.uid : null),
        orderBy("completed", "asc"),
        orderBy("updatedAt", "desc")
      ),
      (snapshot) => {
        setTodos(snapshot.docs);
      },
      (error) => console.log(error)
    );

    // Cleanup
    return () => unsubscribe();
  }, [reduxUser]);

  const addTodo = async (e: FormEvent) => {
    e.preventDefault();

    const title = addTodoTitle.current?.value;
    const note = addTodoNote.current?.value;

    // Clear the form
    cancelForm();

    try {
      const user = getAuth().currentUser;
      await addDoc(collection(db, "todos"), {
        uid: user ? user.uid : null,
        title: title,
        note: note,
        completed: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.log("Error trying to add todo: ", error);
    }
  };

  const resizeTextarea = (element: HTMLTextAreaElement) => {
    if (!element) return;
    element.style.height = "1px";
    element.style.height = element.scrollHeight + "px";
  };

  const cancelForm = () => {
    addTodoTitle.current!.value = "";
    resizeTextarea(addTodoTitle.current!);
    setIsAddTodoOpen(false);
  };

  return (
    <motion.div variants={containerVariants} transition={{ type: "linear" }} style={styles.container}>
      <Head>
        <title>Todolist</title>
      </Head>
      <motion.form
        animate='animate'
        variants={{
          animate: { height: "auto" },
        }}
        transition={{ duration: 0.3 }}
        layout
        key='add-todo'
        style={styles.addTodoContainer}
        whileHover={{ boxShadow: "0 0 10px 5px rgba(0, 0, 0, 0.2)", cursor: "text" }}>
        <motion.textarea
          layout
          placeholder={isAddTodoOpen ? "Title" : "Add a todo..."}
          onClick={() => setIsAddTodoOpen(true)}
          onFocus={() => setIsAddTodoOpen(true)}
          style={{
            fontSize: "1.1rem",
            border: "none",
            fontWeight: isAddTodoOpen ? 500 : 400,
            resize: "none",
            padding: ".4rem 0",
          }}
          onChange={(e) => resizeTextarea(e.target)}
          ref={addTodoTitle}></motion.textarea>
        {isAddTodoOpen && (
          <>
            <textarea
              name='note'
              placeholder='Add a note...'
              style={{ border: "none", marginTop: "0.7rem", resize: "none", height: "1.85rem" }}
              ref={addTodoNote}
              onChange={(e) => resizeTextarea(e.target)}
            />
            <div style={{ textAlign: "center", marginTop: "1.2rem" }}>
              <Button onClick={cancelForm}>Cancel</Button>
              <Button type='primary' onClick={addTodo} style={{ marginLeft: "1rem" }}>
                Add
              </Button>
            </div>
          </>
        )}
      </motion.form>
      <div style={styles.wrapper}>
        <AnimatePresence>
          {todos.map((todo) => (
            <TodoCard todo={todo.data()} id={todo.id} key={todo.id} />
          ))}
        </AnimatePresence>
      </div>
      <AnimatePresence>{hash && <TodoCardModal />}</AnimatePresence>
    </motion.div>
  );
};

export default Home;
