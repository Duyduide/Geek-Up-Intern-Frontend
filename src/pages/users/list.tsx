import {
  List,
  ShowButton,
  useTable,
} from "@refinedev/antd";
import type { BaseRecord } from "@refinedev/core";
import { Space, Table, Tooltip, Avatar } from "antd";
import { generateAvatarUrl } from '../../utils/helperFunction'

export const UsersList = () => {
  const { tableProps } = useTable({
    syncWithLocation: true,
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column dataIndex="id" title={"ID"} />
        <Table.Column 
          dataIndex="name" 
          title={"Avatar"} 
          render={(name, record: BaseRecord) => (
            <Tooltip title={name || `User ${record.id}`}>
              <Avatar 
                src={generateAvatarUrl(name)} 
                size={40} 
                alt={name || `User ${record.id}`}
              />
            </Tooltip>
          )}
        />
        <Table.Column dataIndex="name" title={"Name"} />
        <Table.Column 
          dataIndex="email" 
          title={"Email"} 
          render={(email) => (
            email ? (
              <a href={`mailto:${email}`} title="Send email">
                {email}
              </a>
            ) : (
              "-"
            )
          )}
        />
        <Table.Column 
          dataIndex="phone" 
          title={"Phone"} 
          render={(phone) => (
            phone ? (
              <a href={`tel:${phone}`} title="Call this number">
                {phone}
              </a>
            ) : (
              "-"
            )
            )}
          />
          <Table.Column 
            dataIndex="website" 
            title={"Website"}  
            render={(website) => (
            website ? (
              <a 
              href={`https://${website}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              title="Website link"
              >
              {website}
              </a>
            ) : (
              "-"
            )
            )}/>
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
