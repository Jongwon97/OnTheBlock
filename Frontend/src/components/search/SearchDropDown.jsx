import React, { useState, useRef } from "react";
import { FormLabel } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import styled from "styled-components";

function SearchDropDown() {
  // The forwardRef is important!!
  // Dropdown needs access to the DOM node in order to position the Menu
  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      {children}
      &#x25bc;
    </a>
  ));

  const instruments = [
    {
      id: 1,
      instrumentName: "피아노",
    },
    {
      id: 2,
      instrumentName: "드럼",
    },
    {
      id: 3,
      instrumentName: "칼림바",
    },
  ];

  // forwardRef again here!
  // Dropdown needs access to the DOM of the Menu to measure it
  const CustomMenu = React.forwardRef(
    ({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
      const [inputValue, setInputValue] = useState("");
      const [instrumentName, setInstrumentName] = useState("");
      const selectedInstrumentId = useRef(0);

      
      const handleItemClick = (itemValue, itemText) => {
        setInputValue("");
        selectedInstrumentId.current = itemValue;
        setInstrumentName(itemText);
      };


      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <div>{instrumentName}</div>
          <S.FormControl
            autoFocus
            className="mx-3 my-2 w-auto"
            placeholder="악기 이름을 검색합니다."
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
          />
          {inputValue !== "" ? (
            <ul className="list-unstyled">
              {React.Children.toArray(children)
                .filter(
                  (child) =>
                    !inputValue ||
                    child.props.children.toLowerCase().startsWith(inputValue)
                )
                .map((child) => (
                  <li key={child.props.eventKey}>
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={() =>
                        handleItemClick(
                          child.props.eventKey,
                          child.props.children
                        )
                      }
                    >
                      {child.props.children}
                    </button>
                  </li>
                ))}
            </ul>
          ) : (
            <></>
          )}
        </div>
      );
    }
  );

   const DropdownInstruments = instruments.map((instrument) => (
     <Dropdown.Item key={instrument.id} eventKey={instrument.id}>
       {instrument.instrumentName}
     </Dropdown.Item>
   ));

  return (
    <>
      <Dropdown show={true}>
        <Dropdown.Menu as={CustomMenu} style={{ padding: "0px" }}>
          {DropdownInstruments}
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}

const S = {
  FormControl: styled(Form.Control)`
    margin: 0px !important;
  `
}
export default SearchDropDown;