import {
  Center,
  Square,
  Circle,
  Box,
  Flex,
  Heading,
  List,
  ListItem,
  ListIcon,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  PopoverAnchor,
} from "@chakra-ui/react";
import { useState } from "react";
import style from "../styles/Home.module.css";
import {
  PlusIcon,
  BackSpaceIcon,
  EditIcon,
  CheckIcon,
  RefreshIcon,
} from "../components/Icones";
import { ColorModeSwitcher } from "../components/ColorModeSwitcher";
import TextField from "../components/TextField";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";

interface Tasks {
  id: string;
  task: string;
}

interface CompletedTasks {
  id: string;
  task: string;
}

const dragStyle = (isDragging: boolean, draggableStyle: any) => ({
  border: isDragging ? "1px solid #444" : "",
  borderRadius: isDragging ? "5px" : "",

  ...draggableStyle,
});

export default function Home() {
  const bg = useColorModeValue("white", "#333");
  const shadow = useColorModeValue(
    "0 0 20px 0 rgba(0,0,0,25%)",
    "0 0 20px 0 rgba(0,0,0,70%)"
  );
  const span = useColorModeValue(style.taskValue, style.taskValueDark);

  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [completedTasks, setCompletedTasks] = useState<CompletedTasks[]>([]);
  const [inputTaskValue, setInputTaskValue] = useState<string>("");
  const [inputEditTaskValue, setInputEditTaskValue] = useState<string>("");

  const addTask = (val: any) => {
    if (val.key == "Enter" && val.target.value != "") {
      const id = Math.floor(Date.now() * Math.random()).toString(36);
      setTasks([...tasks, { id: id, task: val.target.value }]);
      setInputTaskValue("");
    }
  };

  const editTask = (val: any, index: number) => {
    let newTask = [...tasks];
    newTask[index].task = val.target.value;
    setTasks(newTask);
    setInputEditTaskValue("");
  };

  const removeTask = (index: number) => {
    let newTask = [...tasks];
    newTask.splice(index, 1);
    setTasks(newTask);
  };

  const completeTask = (val: any, index: number) => {
    let newTask = [...tasks];
    newTask.splice(index, 1);
    setTasks(newTask);
    setCompletedTasks([...completedTasks, { id: val.id, task: val.task }]);
  };

  const backTask = (val: any, index: number) => {
    let newTask = [...completedTasks];
    newTask.splice(index, 1);
    setCompletedTasks(newTask);
    setTasks([...tasks, { id: val.id, task: val.task }]);
  };

  const removeCompletedTask = (index: number) => {
    let newTask = [...completedTasks];
    newTask.splice(index, 1);
    setCompletedTasks(newTask);
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const items = Array.from(tasks);
    const [newOrder] = items.splice(source.index, 1);
    items.splice(destination.index, 0, newOrder);

    setTasks(items);
  };

  return (
    <Flex bg={bg} h="100vh" align="center" justify="center">
      <Box bg={bg} shadow={shadow} w="620px" h="765px" borderRadius="20px">
        <Center
          h="61px"
          bg="linear-gradient(90deg, #23A1C9 14.68%, #5C9D1C 99.03%)"
          borderTopRadius="20px"
        >
          <Heading
            color="white"
            fontSize="24px"
            fontFamily="Montserrat, sans-serif"
            fontWeight="600"
          >
            My TodoList
          </Heading>
          <Box pos="absolute" top="10px" right="10px">
            <ColorModeSwitcher />
          </Box>
        </Center>

        <Box w="100%" h="calc(100% - 61px)" p="20px">
          <Flex w="100%" h="49%" direction="column" overflowY="auto">
            <Flex justify="space-between" align="center">
              <h3 className={style.txtLinearBg}>Tarefas a fazer:</h3>

              <Popover>
                <PopoverTrigger>
                  <button
                    className={useColorModeValue(
                      style.PlusIcon,
                      style.PlusIconDark
                    )}
                  >
                    {PlusIcon}
                  </button>
                </PopoverTrigger>
                <PopoverContent bg={bg}>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Adicionar Tarefa:</PopoverHeader>
                  <PopoverBody>
                    <TextField
                      style={{ width: "90%", height: "35px" }}
                      type="text"
                      value={inputTaskValue}
                      onChange={setInputTaskValue}
                      onKeyDown={(val) => addTask(val)}
                    />
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </Flex>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="list">
                {(provided) => (
                  <List
                    ml="15px"
                    spacing={0}
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {tasks.map((value, index) => {
                      return (
                        <Draggable
                          key={value.id}
                          draggableId={value.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <ListItem
                              p="5px"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={dragStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              <Flex align="center">
                                <Flex align="center" w="85%">
                                  <button
                                    onClick={() => completeTask(value, index)}
                                    className={style.CheckIcon}
                                  >
                                    {CheckIcon}
                                  </button>
                                  <span
                                    className={span}
                                  >
                                    {value.task}
                                  </span>
                                </Flex>

                                <Flex align="center">
                                  <Popover>
                                    <PopoverTrigger>
                                      <button className={style.EditIcon}>
                                        {EditIcon}
                                      </button>
                                    </PopoverTrigger>
                                    <PopoverContent>
                                      <PopoverArrow />
                                      <PopoverCloseButton />
                                      <PopoverHeader>
                                        Editar Tarefa:
                                      </PopoverHeader>
                                      <PopoverBody>
                                        <TextField
                                          style={{
                                            width: "90%",
                                            height: "35px",
                                          }}
                                          type="text"
                                          value={inputEditTaskValue}
                                          onChange={setInputEditTaskValue}
                                          onKeyDown={(val) => {
                                            if (val.key == "Enter") {
                                              editTask(val, index);
                                            }
                                          }}
                                        />
                                      </PopoverBody>
                                    </PopoverContent>
                                  </Popover>

                                  <button
                                    onClick={() => removeTask(index)}
                                    className={style.BackSpaceIcon}
                                  >
                                    {BackSpaceIcon}
                                  </button>
                                </Flex>
                              </Flex>
                            </ListItem>
                          )}
                        </Draggable>
                      );
                    })}
                  </List>
                )}
              </Droppable>
            </DragDropContext>
          </Flex>

          <Divider />

          <Flex w="100%" h="49%" mt="10px" direction="column" overflowY="auto">
            <Flex>
              <h3 className={style.txtLinearBg}>Tarefas concluídas:</h3>
            </Flex>
            <List ml="15px" spacing={3}>
              {completedTasks.map((value, index) => {
                return (
                  <ListItem key={value.id}>
                    <Flex align="center">
                      <Flex align="center" w="85%">
                        <button className={style.CheckedIcon}>
                          {CheckIcon}
                        </button>
                        <span
                          className={span}
                        >
                          {value.task}
                        </span>
                      </Flex>

                      <Flex align="center">
                        <button
                          onClick={() => backTask(value, index)}
                          className={style.RefreshIcon}
                        >
                          {RefreshIcon}
                        </button>

                        <button
                          onClick={() => removeCompletedTask(index)}
                          className={style.BackSpaceIcon}
                        >
                          {BackSpaceIcon}
                        </button>
                      </Flex>
                    </Flex>
                  </ListItem>
                );
              })}
            </List>
          </Flex>
        </Box>
      </Box>
    </Flex>
  );
}
