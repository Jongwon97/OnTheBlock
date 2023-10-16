import { Placeholder } from "react-bootstrap";
import styled from "styled-components";

function HorizontalDropdown(props) {
  return (
    <S.Wrap>
      <S.Dropdown>
        <S.Button>Select</S.Button>
        <S.DropdownOptions>
          <li className="option">
            <a href="#">Home</a>
          </li>
          <li className="option">
            <a href="#">About</a>
          </li>
          <li className="option">
            <a href="#">Portfolio</a>
          </li>
          <li className="option">
            <a href="#">Contact</a>
          </li>
        </S.DropdownOptions>
      </S.Dropdown>
    </S.Wrap>
  );
}

const S = {
    Wrap: styled.div`
        position: absolute;
        width: 400px;
        height: 250px;
    `,

  Button: styled.button`
    position: relative;
    background: none;
    border: none;
    outline: none;
    font-size: 16px;
    border-bottom: 2px solid black;
    padding-bottom: 8px;
    min-width: 150px;
    text-align: left;
    outline: none;
    cursor: pointer;
    z-index: 2;

    &:after {
      content: "▾";
      position: absolute;
      right: 0px;
      top: 0%;
    }
  `,

  Dropdown: styled.div`
    position: relative;
  `,

  DropdownOptions: styled.div`
            list-style: none;
          top: 100%;
          padding: 0;
          background: white;
          box-shadow: 0 2px 4px rgba(black, 0.24);
          display: inline-block;
          position: absolute;
          left: 0;
          bottom: 0;

          opacity: 0;
          transform: translate3d(-20px, 0px, 0);

          transition: opacity 0.1s $easing, transform 0.3s $easing;

          transform-origin: 0 100%;
          z-index: 1;

          &.open {
            opacity: 1;
            transform: translate3d(0, 0, 0);
            z-index: 5;
          }

          li > {
            display: inline-block;
            
              

              &.active {
                border-bottom: 2px solid black;
                color: black;
                &:hover {
                  color: black;
                }
              }
            }
          }
  `,

  S: styled.div`
    $primary: #2975da;
    $easing: cubic-bezier(0.5, 2, 0.5, 0.75);

      

        .dropdown-options {
          
        }
      }
    }
  `,
};


export default HorizontalDropdown;
