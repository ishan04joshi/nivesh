import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import React from "react";
import dayjs from "dayjs";

const DailyChangeTable = ({ dailyChange }) => {
  return (
    <TableContainer>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Date:</Th>
            <Th>Daily Change %</Th>
          </Tr>
        </Thead>
        <Tbody>
          {dailyChange.map((dailyChange) => (
            <Tr key={dailyChange.x}>
              <Td>{dayjs(dailyChange.x).format("YYYY-MM-DD")}</Td>
              <Td>{dailyChange.y}%</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default DailyChangeTable;
