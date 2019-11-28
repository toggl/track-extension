import styled from '@emotion/styled';

export const Row = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

export const Heading = styled.h1`
  font-size: 48px;
  color: white;
  margin: 0;
  padding-bottom: 6px;
`;

export const Subheading = styled.h2`
  color: white;
  font-size: 21px;
  font-weight: 500;
  margin-bottom: 50px;
`;

export const Button = styled.button`
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: baseline;
  justify-content: center;
  background-color: #e24f54;
  border: 0;
  border-radius: 24px;
  color: #fff;
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  font-family: GTWalsheim,Arial,sans-serif;
  font-weight: 500;
  height: 48px;
  min-width: 218px;
  position: relative;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  width: auto;
  padding: 0 15px;
  outline: none;
`;

export const CenteredButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Content = styled.div`
  min-height: 40vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const Link = styled.a`
  color: #282a2d;
  line-height: 36px;
  text-decoration: none;
`;
