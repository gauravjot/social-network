import React from "react";
import { logoutUser, removeAllPosts} from "../../redux/actions";
import logo from "../../assets/images/logo.png";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { BACKEND_SERVER_DOMAIN } from "../../settings";
import { timeSince } from "../../utils/timesince";
import ThemeToggle from "../global/ThemeToggle"



//TODO: noti type 5, replied to a comment


export default function Navbar() {
    const user = useSelector((state) => state.user);
    const [notifications, setNotifications] = React.useState([]);
    const [unseen_notifs, setUnseenNotifs] = React.useState(0);
    const [showNotifications, setShowNotifications] = React.useState(false);
    const dispatch = useDispatch();
    const history = useHistory();

    if (Object.keys(user).length === 0) {

        history.push("/login");
    }

    const logOut = () => {
        dispatch(logoutUser());
        dispatch(removeAllPosts());
        history.push("/login");
    };

    React.useEffect(() => {
        let config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: user.token,
            },
        };
        axios
            .get(BACKEND_SERVER_DOMAIN + "/api/notifications/", config)
            .then(function (response) {
                setNotifications(response.data);
                let count = 0;
                response.data.map((notif, index) => {
                    if (notif.seen == 0) {
                        count += 1;
                    }
                    if (response.data.length == index + 1) {
                        setUnseenNotifs(count);
                    }
                });
            })
            .catch(function (err) {
                console.log(err.response);
                try{
                    if (err.response.status ==  400) {
                        logOut();
                    }
                }
                catch(err) {
                    console.log(err)
                }
            });
    }, []);

    const markAsSeen = () => {
        let sh = !showNotifications;
        setShowNotifications(sh);
        if (sh) {
            document.addEventListener("click", handleClickOutside, true);
        } else {
            document.removeEventListener("click", handleClickOutside, true);
        }
        if (unseen_notifs > 0) {
            let config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: user.token,
                },
            };
            axios
                .put(
                    BACKEND_SERVER_DOMAIN + "/api/notifications/seen/",
                    {},
                    config
                )
                .then(function (response) {
                    setUnseenNotifs(0);
                })
                .catch(function (err) {
                    console.log(err);
                });
        }
    };

    const handleClickOutside = () => {
        setShowNotifications(false);
        document.removeEventListener("click", handleClickOutside, true);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light">
            <div className="container">
                <div className="container-fluid row">
                    <div className="col-lg-3 col-12 nav-brand">
                        <h6>
                            <img src={logo} />
                        </h6>
                        <div className="mobile-notification-icon">
                            <li className="notifications d-block d-lg-none">
                            <button onClick={markAsSeen}>
                                                <i className="far fa-bell"></i>
                                                {unseen_notifs > 0 ? (
                                                    <span>{unseen_notifs}</span>
                                                ) : (
                                                    ""
                                                )}
                                            </button>
                                            <div
                                                className={
                                                    !showNotifications
                                                        ? "hide"
                                                        : "list"
                                                }
                                            >
                                                {notifications &&
                                                notifications.length > 0
                                                    ? notifications.slice().reverse().map(
                                                          (notif) => (
                                                              <Link className={(notif.seen == 1) ? "notif seen":"notif"}
                                                                  to={notif.noti ==
                                                                    1 ? (
                                                                        "/post/"+notif.about
                                                                    ) : notif.noti ==
                                                                      0 ? (
                                                                        "/post/"+notif.about
                                                                    ) : notif.noti ==
                                                                      2 ? (
                                                                        "/post/"+notif.about
                                                                    ) : notif.noti ==
                                                                      3 ? (
                                                                        "/u/"+ notif.person.slug
                                                                    ) : notif.noti ==
                                                                      4 ? (
                                                                        "/u/"+ notif.person.slug
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                              >
                                                                  <div>
                                                                      {notif.noti ==
                                                                      1 ? (
                                                                          <i className="far fa-comment-alt"></i>
                                                                      ) : notif.noti ==
                                                                        0 ? (
                                                                          <i className="far fa-thumbs-up"></i>
                                                                      ) : notif.noti ==
                                                                        2 ? (
                                                                          <i className="far fa-thumbs-up"></i>
                                                                      ) : notif.noti ==
                                                                        3 ? (
                                                                          <i className="fas fa-user-plus"></i>
                                                                      ) : notif.noti ==
                                                                        4 ? (
                                                                          <i className="fas fa-user-check"></i>
                                                                      ) : (
                                                                          ""
                                                                      )}
                                                                      <span className="uname">
                                                                          {
                                                                              notif
                                                                                  .person
                                                                                  .first_name
                                                                          }{" "}
                                                                          {
                                                                              notif
                                                                                  .person
                                                                                  .last_name
                                                                          }
                                                                      </span>
                                                                      {notif.noti ==
                                                                      1
                                                                          ? " commented on your post."
                                                                          : notif.noti ==
                                                                            0
                                                                          ? " liked your post."
                                                                          : notif.noti ==
                                                                            2
                                                                          ? " liked your comment on a post."
                                                                          : notif.noti ==
                                                                            3
                                                                          ? " sent you friend request."
                                                                          : notif.noti ==
                                                                            4
                                                                          ? " accepted you friend request."
                                                                          : ""}
                                                                      <br />
                                                                      <span className="when">
                                                                          {timeSince(
                                                                              notif.created
                                                                          )}
                                                                      </span>
                                                                  </div>
                                                              </Link>
                                                          )
                                                      )
                                                    : <div className="notif"><div className="text-center">No new notifications</div></div>}
                                            </div>
                            </li>
                        </div>
                        <button
                            className="navbar-toggler"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#navbarToggler"
                            data-toggle="collapse"
                            data-target="#navbarToggler"
                            aria-controls="navbarToggler"
                            aria-expanded="false"
                            aria-label="Toggle navigation"
                        >
                            <i className="fas fa-bars"></i>
                        </button>
                    </div>
                    <div className="col-lg-9 col-12">
                        <div
                            className="collapse navbar-collapse"
                            id="navbarToggler"
                        >
                            <div className="row w-100">
                                <div className="col-lg-8 col-12">
                                    <form className="d-flex">
                                        <input
                                            type="search"
                                            placeholder="Search"
                                            aria-label="Search"
                                        />
                                        <button type="submit">
                                            <i className="fas fa-search"></i>
                                        </button>
                                    </form>
                                </div>
                                <div className="col-lg-4 col-12">
                                    <ul className="navbar-nav">
                                        <li className="d-md-block d-lg-none">
                                            <Link to={"/dashboard"}>
                                                <i className="far fa-newspaper"></i>
                                                &nbsp;&nbsp;&nbsp; Feed
                                            </Link>
                                        </li>
                                        <li className="d-md-block d-lg-none">
                                            <Link to={"/friends"}>
                                                <i className="fas fa-user-friends"></i>
                                                &nbsp;&nbsp;&nbsp; Friends
                                            </Link>
                                        </li>
                                        <li className="d-md-block d-lg-none">
                                            <Link to={"/findfriends"}>
                                                <i className="fas fa-search"></i>
                                                &nbsp;&nbsp;&nbsp; Find Friends
                                            </Link>
                                        </li>
                                        <li className="d-md-block d-lg-none">
                                            <Link to={"/u/" + user.slug}>
                                                <i className="far fa-user"></i>
                                                &nbsp;&nbsp;&nbsp; Profile
                                            </Link>
                                        </li>
                                        <li className="notifications d-none d-lg-block">
                                            <button onClick={markAsSeen}>
                                                <i className="far fa-bell"></i>
                                                {unseen_notifs > 0 ? (
                                                    <span>{unseen_notifs}</span>
                                                ) : (
                                                    ""
                                                )}
                                            </button>
                                            <div
                                                className={
                                                    !showNotifications
                                                        ? "hide"
                                                        : "list"
                                                }
                                            >
                                                {notifications &&
                                                notifications.length > 0
                                                    ? notifications.slice().reverse().map(
                                                          (notif) => (
                                                              <Link className={(notif.seen == 1) ? "notif seen":"notif"}
                                                                  to={notif.noti ==
                                                                    1 ? (
                                                                        "/post/"+notif.about
                                                                    ) : notif.noti ==
                                                                      0 ? (
                                                                        "/post/"+notif.about
                                                                    ) : notif.noti ==
                                                                      2 ? (
                                                                        "/post/"+notif.about
                                                                    ) : notif.noti ==
                                                                      3 ? (
                                                                        "/u/"+ notif.person.slug
                                                                    ) : notif.noti ==
                                                                      4 ? (
                                                                        "/u/"+ notif.person.slug
                                                                    ) : (
                                                                        ""
                                                                    )}
                                                              >
                                                                  <div>
                                                                      {notif.noti ==
                                                                      1 ? (
                                                                          <i className="far fa-comment-alt"></i>
                                                                      ) : notif.noti ==
                                                                        0 ? (
                                                                          <i className="far fa-thumbs-up"></i>
                                                                      ) : notif.noti ==
                                                                        2 ? (
                                                                          <i className="far fa-thumbs-up"></i>
                                                                      ) : notif.noti ==
                                                                        3 ? (
                                                                          <i className="fas fa-user-plus"></i>
                                                                      ) : notif.noti ==
                                                                        4 ? (
                                                                          <i className="fas fa-user-check"></i>
                                                                      ) : (
                                                                          ""
                                                                      )}
                                                                      <span className="uname">
                                                                          {
                                                                              notif
                                                                                  .person
                                                                                  .first_name
                                                                          }{" "}
                                                                          {
                                                                              notif
                                                                                  .person
                                                                                  .last_name
                                                                          }
                                                                      </span>
                                                                      {notif.noti ==
                                                                      1
                                                                          ? " commented on your post."
                                                                          : notif.noti ==
                                                                            0
                                                                          ? " liked your post."
                                                                          : notif.noti ==
                                                                            2
                                                                          ? " liked your comment on a post."
                                                                          : notif.noti ==
                                                                            3
                                                                          ? " sent you friend request."
                                                                          : notif.noti ==
                                                                            4
                                                                          ? " accepted you friend request."
                                                                          : ""}
                                                                      <br />
                                                                      <span className="when">
                                                                          {timeSince(
                                                                              notif.created
                                                                          )}
                                                                      </span>
                                                                  </div>
                                                              </Link>
                                                          )
                                                      )
                                                    : <div className="notif"><div className="text-center">No new notifications</div></div>}
                                            </div>
                                        </li>
                                        <li className="align-end">
                                            <div className="nav-theme-toggler">
                                                <ThemeToggle />
                                            </div>
                                            <button onClick={logOut}>
                                                Logout
                                                <i className="fas fa-sign-out-alt"></i>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
