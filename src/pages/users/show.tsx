import { Show, TextField, useTable, ShowButton } from "@refinedev/antd";
import { useShow, useMany } from "@refinedev/core";
import { Typography, Avatar, Space, Table, Button } from "antd";
import { generateAvatarUrl, getInitials } from '../../utils/helperFunction'
const { Title } = Typography;

export const UserShow = () => {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;
  const record = data?.data;

  // Fetch the user's albums
  const { tableProps: albumsTableProps } = useTable({
    resource: "albums",
    syncWithLocation: false,
    filters: {
      permanent: [
        {
          field: "userId",
          operator: "eq",
          value: record?.id,
        },
      ],
    },
    queryOptions: {
      enabled: !!record?.id,
    },
  });

  return (
    <Show isLoading={isLoading} headerButtons={[]}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
        {record?.name && (
          <Avatar 
            src={generateAvatarUrl(record.name)} 
            size={64}
            style={{ marginRight: "16px" }}
          >
            {getInitials(record.name)}
          </Avatar>
        )}
        <div>
          <Title level={4} style={{ margin: 0 }}>{record?.name}</Title>
          {record?.email && (
            <a href={`mailto:${record.email}`} style={{ color: "#1890ff" }}>
              {record.email}
            </a>
          )}
        </div>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          {record?.phone && (
            <div>
              <Title level={5} style={{ margin: 0 }}>Phone</Title>
              <a href={`tel:${record.phone}`}>{record.phone}</a>
            </div>
          )}
          
          {record?.website && (
            <div>
              <Title level={5} style={{ margin: 0 }}>Website</Title>
              <a href={`https://${record.website}`} target="_blank" rel="noopener noreferrer">
                {record.website}
              </a>
            </div>
          )}
        </Space>
      </div>

      <Title level={4} style={{ marginTop: "32px" }}>Albums</Title>
      <Table {...albumsTableProps} rowKey="id">
        <Table.Column dataIndex="id" title="ID" />
        <Table.Column dataIndex="title" title="Title" />
        <Table.Column 
          title="Actions" 
          render={(_, record) => (
            <ShowButton size="small" recordItemId={record.id} />
          )} 
        />
      </Table>
    </Show>
  );
};