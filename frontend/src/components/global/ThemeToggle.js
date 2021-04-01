import React from 'react'

export default function ThemeToggle() {
    let toggleBtn = React.useRef();

    const enableDarkMode = () => {
        document.body.classList.add("darkmode")
        localStorage.setItem("darkMode","enabled");
        toggleBtn.current.classList.add("enabled")
    }

    const disableDarkMode = () => {
        document.body.classList.remove("darkmode")
        localStorage.setItem("darkMode",null);
        toggleBtn.current.classList.remove("enabled")
    }

    const toggle = () => {
        let darkMode = localStorage.getItem("darkMode")
        if (darkMode !== 'enabled') {
            enableDarkMode();
        } else {
            disableDarkMode();
        }
    }

    React.useEffect(()=> {
        let darkMode = localStorage.getItem("darkMode")
        if (darkMode === 'enabled') {
            document.body.classList.add("darkmode")
            toggleBtn.current.classList.add("enabled")
        } else {
            document.body.classList.remove("darkmode")
            toggleBtn.current.classList.remove("enabled")
        }
    },[])

    return (
        <div className="darkmode-toggle" onClick={toggle}>
            <button ref={toggleBtn}><i className="fas fa-moon"></i></button>
        </div>
    )
}
