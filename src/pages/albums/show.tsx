import { useShow, useOne } from "@refinedev/core";
import { Show } from "@refinedev/antd";
import { Typography, Avatar, Space, Row, Col, Modal, Button, Spin } from "antd";
import { useState, useEffect } from "react";
import { generateAvatarUrl, getInitials } from '../../utils/helperFunction'

import { 
  LeftOutlined, 
  RightOutlined, 
  ZoomInOutlined, 
  ZoomOutOutlined, 
  RotateLeftOutlined, 
  RotateRightOutlined, 
  FullscreenOutlined 
} from "@ant-design/icons";
import { Link } from "react-router";

const { Title } = Typography;

export const AlbumShow = () => {
  const { queryResult } = useShow({});
  const { data, isLoading } = queryResult;
  const record = data?.data;

  // State for image preview modal
  const [previewOpen, setPreviewOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [photos, setPhotos] = useState<{id: number, title: string, url: string, thumbnailUrl: string}[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch the Album
  const { data: albumData, isLoading: userIsLoading } = useOne({
    resource: "albums",
    id: record?.id || "",
    queryOptions: {
      enabled: !!record?.userId,
    },
  });

  // Fetch user who owns this album
  const { data: userData } = useOne({
    resource: "users",
    id: albumData?.data?.userId || "",
    queryOptions: {
      enabled: !!albumData?.data?.userId,
    },
  });

  // Fetch photos for this album
  useEffect(() => {
    const fetchPhotos = async () => {
      if (record?.id) {
        setLoading(true);
        try {
          const response = await fetch(`https://jsonplaceholder.typicode.com/photos?_end=10&_start=0&albumId=${record?.id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch photos');
          }
          const data = await response.json();
          setPhotos(data);
        } catch (error) {
          console.error('Error fetching photos:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPhotos();
  }, [record?.id]);

  const goToPrevious = () => {
    setCurrentImage((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImage((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const openPreview = (index: number) => {
    setCurrentImage(index);
    setPreviewOpen(true);
  };

  return (
    <Show isLoading={isLoading || userIsLoading} headerButtons={[]}>
      <div style={{ marginBottom: "32px" }}>
        <Space align="start">
            <Avatar 
            src={generateAvatarUrl(userData?.data?.name)} 
            size={48}
            style={{ backgroundColor: "#e91e63" }}
            >
            {getInitials(userData?.data?.name || "")}
            </Avatar>
          <Space direction="vertical" size={0}>
            <Title level={5} style={{ margin: 0 }}>
              {userData?.data?.name && (
              <Link to={`/users/show/${userData?.data?.id}`} style={{ color: "#1890ff" }}>
                {userData?.data?.name}
              </Link>
            )}
            </Title>
            {userData?.data?.email && (
              <a href={`mailto:${userData?.data?.email}`} style={{ color: "#1890ff" }}>
                {userData?.data?.email}
              </a>
            )}
          </Space>
        </Space>
      </div>

      <Title level={4} style={{ marginBottom: "24px" }}>
        {record?.title || "Loading..."}
      </Title>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {photos.map((photo: any, index) => (
            <Col xs={24} sm={12} md={8} lg={6} key={photo.id}>
              <div 
                style={{ position: "relative", cursor: "pointer" }}
                onClick={() => openPreview(index)}
              >
                <img 
                  src={photo.thumbnailUrl} 
                  alt={photo.title} 
                  style={{ 
                    width: "100%", 
                    height: "auto", 
                    borderRadius: "4px",
                    display: "block"
                  }} 
                />
                <div style={{ 
                  position: "absolute", 
                  bottom: 0, 
                  left: 0, 
                  right: 0, 
                  background: "rgba(0,0,0,0.6)", 
                  padding: "8px", 
                  color: "#fff",
                  fontSize: "12px",
                  borderBottomLeftRadius: "4px",
                  borderBottomRightRadius: "4px"
                }}>
                  {photo.title}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        open={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        width="100%"
        style={{ 
          top: 0, 
          padding: 0,
          maxWidth: "100vw",
          margin: 0
        }}
        styles={{
          body: { 
            height: "100vh", 
            padding: 0,
            display: "flex", 
            flexDirection: "column",
            backgroundColor: "#333"
          },
          mask: { backgroundColor: "rgba(0,0,0,0.85)" }
        }}
        closable
      >
        <div style={{ 
          flexGrow: 1, 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          position: "relative"
        }}>
          <Button 
            icon={<LeftOutlined />} 
            style={{ 
              position: "absolute", 
              left: 20,
              backgroundColor: "rgba(0,0,0,0.2)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
            onClick={goToPrevious}
          />
          
          <img 
            src={photos[currentImage]?.url} 
            alt={photos[currentImage]?.title}
            style={{ maxHeight: "80vh", maxWidth: "90%" }}
          />
          
          <Button 
            icon={<RightOutlined />} 
            style={{ 
              position: "absolute", 
              right: 20,
              backgroundColor: "rgba(0,0,0,0.2)",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: 40,
              height: 40,
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
            onClick={goToNext}
          />
        </div>

        <div style={{ 
          padding: "15px 0", 
          display: "flex", 
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#444",
          borderTop: "1px solid #555"
        }}>
          <div style={{ 
            marginRight: "auto", 
            marginLeft: 20, 
            color: "white" 
          }}>
            {photos.length > 0 ? `${currentImage + 1} / ${photos.length}` : "0 / 0"}
          </div>
          
          <Space size="middle">
            <Button 
              icon={<RotateLeftOutlined />} 
              ghost
              style={{ borderColor: "#666", color: "white" }}
            />
            <Button 
              icon={<RotateRightOutlined />} 
              ghost
              style={{ borderColor: "#666", color: "white" }}
            />
            <Button 
              icon={<ZoomOutOutlined />} 
              ghost
              style={{ borderColor: "#666", color: "white" }}
            />
            <Button 
              icon={<ZoomInOutlined />} 
              ghost
              style={{ borderColor: "#666", color: "white" }}
            />
            <Button 
              icon={<FullscreenOutlined />} 
              ghost
              style={{ borderColor: "#666", color: "white" }}
            />
          </Space>
          
          <div style={{ marginLeft: "auto", width: 20 }}></div>
        </div>
      </Modal>
    </Show>
  );
};