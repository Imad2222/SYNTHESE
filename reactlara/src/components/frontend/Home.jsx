
// import Navbar from "../../layouts/frontend/Navbar";

const Home = () => {
  const marqueeStyle = {
    display: 'inline-block',
    whiteSpace: 'nowrap',
    animation: 'slide-in 10s linear infinite'
  };

  const containerStyle = {
    width: '100%',
    overflow: 'hidden',
    position: 'relative'
  };

  return (
    <div>
      {/* <Navbar/> */}
      <div style={containerStyle}>
        <h1 style={marqueeStyle}>Welcome!..</h1>
      </div>

      {/* Keyframes for the slide-in animation */}
      <style >{`
        @keyframes slide-in {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}

export default Home;
