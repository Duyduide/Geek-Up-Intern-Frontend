import {
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import { type BaseRecord, useMany } from "@refinedev/core";
import { Space, Table, Tooltip, Avatar } from "antd";
import { generateAvatarUrl } from '../../utils/helperFunction'

export const AlbumList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  // Fetch user data for all blog posts to get usernames
  const { data: usersData, isLoading: usersIsLoading } = useMany({
    resource: "users",
    ids:
      tableProps?.dataSource
        ?.map((item) => item?.userId)
        .filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column dataIndex="title" title={"Title"} />
        <Table.Column 
          dataIndex="userId" 
          title={"User"} 
          render={(userId, record: BaseRecord) => {
            // Find the user data for this post
            const user = usersData?.data?.find(user => user?.id?.toString() === userId?.toString());
            const username = user?.name || `User ${userId}`;
            
            return (
              <Space>
                <Tooltip title={username}>
                  <Avatar 
                    src={generateAvatarUrl(username)} 
                    size={40} 
                    alt={username}
                  />
                </Tooltip>
                <span>{username}</span>
              </Space>
            );
          }}
        />
        
        <Table.Column
          title={"Actions"}
          dataIndex="actions"
          render={(_, record: BaseRecord) => (
            <Space>
              <ShowButton size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};