import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="not-found">
      <div className="container">
        <h2 className="layout-title not-found__layout-title">Page Not Found</h2>
        <div className="not-found__img-wrapper">
          <img
            src="https://images.unsplash.com/photo-1616530940355-351fabd9524b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1935&q=80&w=1920"
            alt="not-found-backdrop"
          />
        </div>
        <Link to="/" className="btn btn--lg btn--transparent not-found__btn">
          Go Home
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
