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

const FundGraphTable = ({ fundGraph }) => {
  return (
    <TableContainer>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Date:</Th>
            <Th>Fund Value</Th>
          </Tr>
        </Thead>
        <Tbody>
          {fundGraph.map((entry) => (
            <Tr key={entry.x}>
              <Td>{dayjs(entry.x).format("YYYY-MM-DD")}</Td>
              <Td>{entry.y} /-</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};

export default FundGraphTable;
