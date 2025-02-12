const FallbackLogo = () => {
  return (
    <div
      style={{
        height: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img height={80} width={80} src="/logo.svg" alt="RING! logo" />
    </div>
  );
};

export default FallbackLogo;
