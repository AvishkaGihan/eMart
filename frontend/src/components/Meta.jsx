import { Helmet } from "react-helmet-async";

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Welcome to eMart",
  description: "Discover a wide range of top-quality electronics and more",
  keywords:
    "electronics, eMart, online shopping, tech products, gadgets, diverse product range",
};

export default Meta;
