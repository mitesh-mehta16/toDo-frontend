import styled from "styled-components";
import { Button } from "reactstrap";

const DeleteTask = (props) => {
  const CustomButton = styled(Button)({
    margin: "0px 6px",
    variant: "contained",
  });
  return (
    <>
      <CustomButton onClick={() => props.onDelete(props.deleteKey)}>
        Delete
      </CustomButton>
    </>
  );
};

export default DeleteTask;
