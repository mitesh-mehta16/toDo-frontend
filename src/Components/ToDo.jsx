import { useState } from "react";
import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import styled from "styled-components";
import DeleteTask from "./DeleteTask";

const Span = styled.span`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

const FlexDiv = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
`;

const CustomButton = styled(Button)({
  margin: "0px 6px",
});

const MyToDo = () => {
  let [input, setInput] = useState({
    title: "",
    description: "",
    status: "New",
    id: "",
  });
  const [list, setList] = useState([]);
  const [edited, setEdited] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const addToList = async () => {
    setList((prevList) => [...prevList, { ...input }]);
    try {
      const response = await fetch("http://localhost:8081/toDo", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(input),
      });

      if (response.ok) {
        console.log("Form data submitted successfully");
      } else {
        console.error("Error submitting form data");
      }
    } catch (error) {
      console.error("Error submitting form data", error);
    }
    console.log(input);
    const emptyFormData = Object.fromEntries(
      Object.keys(input).map((key) => [key, ""])
    );
    emptyFormData["status"] = "New";
    setInput(emptyFormData);
  };

  const captureTaskData = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInput((prev) => {
      return { ...prev, [`${name}`]: value, id: new Date().getTime() };
    });
  };

  const removeTask = (id) => {
    setList((prevState) => prevState.filter((data) => data.id !== id));

    try {
      const response = fetch(`http://localhost:8081/toDo/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("Data updated successfully");
      } else {
        console.error("Failed to update data");
      }
    } catch (error) {
      console.error("Error updating data", error);
    }
  };

  const edit = (e) => {
    setEdited((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const saveUpdatedTask = () => {
    setList((prevState) =>
      prevState.map((data) => {
        if (data.id === edited.id) return edited;
        return data;
      })
    );
    try {
      const response = fetch(`http://localhost:8081/toDo/${edited.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(edited),
      });

      if (response.ok) {
        console.log("Data updated successfully");
      } else {
        console.error("Failed to update data");
      }
    } catch (error) {
      console.error("Error updating data", error);
    }
    setEdited({});
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleStatusSelect = (status) => {
    setEdited((prev) => {
      return { ...prev, ["status"]: status };
    });
  };
  console.log("list", { list });
  return (
    <>
      <FormGroup floating>
        <Input
          id="title"
          variant="outlined"
          value={input.title}
          name="title"
          placeholder="Enter your task's title here"
          onChange={(e) => captureTaskData(e)}
        />
        <Label for="title">Title</Label>
      </FormGroup>
      <FormGroup floating>
        <Input
          id="description"
          variant="outlined"
          value={input.description}
          name="description"
          placeholder="Enter your task's description here"
          onChange={(e) => captureTaskData(e)}
        />
        <Label for="description">Description</Label>
      </FormGroup>

      <CustomButton variant="contained" onClick={addToList}>
        Add
      </CustomButton>

      <h3>To do List</h3>
      <div>
        {list.map((data) => {
          return edited.id === data.id ? (
            <div key={data.id} style={{ paddingBottom: "6px" }}>
              <FormGroup floating>
                <Input
                  id="edited-title"
                  label="Edit Task"
                  name="title"
                  placeholder="Enter your edited title here"
                  value={edited.title}
                  onChange={edit}
                />
                <Label for="edited-title">Edited Title</Label>
              </FormGroup>
              <FormGroup floating>
                <Input
                  id="edited-description"
                  name="description"
                  variant="outlined"
                  placeholder="Enter your edited description here"
                  value={edited.description}
                  onChange={edit}
                />
                <Label for="edited-description">Edited Description</Label>
              </FormGroup>
              <Dropdown
                isOpen={dropdownOpen}
                toggle={toggleDropdown}
                style={{ marginBottom: "6px" }}
              >
                <DropdownToggle caret>{data.status}</DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={() => handleStatusSelect("New")}>
                    New
                  </DropdownItem>
                  <DropdownItem onClick={() => handleStatusSelect("Ongoing")}>
                    Ongoing
                  </DropdownItem>
                  <DropdownItem onClick={() => handleStatusSelect("On Hold")}>
                    On Hold
                  </DropdownItem>
                  <DropdownItem onClick={() => handleStatusSelect("Complete")}>
                    Complete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <CustomButton variant="contained" onClick={saveUpdatedTask}>
                Save
              </CustomButton>
            </div>
          ) : (
            <div key={data.id}>
              <div>
                <Span>Title: {data.title}</Span>
                <Span>Description: {data.description}</Span>
                <Span style={{ justifyContent: "normal" }}>
                  Status :<Badge color="primary">{data.status}</Badge>
                </Span>
              </div>
              <br />

              <CustomButton
                variant="contained"
                onClick={() => setEdited({ ...data })}
              >
                Edit
              </CustomButton>

              {/* <CustomButton
                variant="contained"
                onClick={() => removeTask(data.id)}
              >
                Delete
              </CustomButton> */}
              {console.log("data.id: ", data.id)}
              <DeleteTask
                deleteKey={data.id}
                onDelete={removeTask}
              ></DeleteTask>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default MyToDo;
