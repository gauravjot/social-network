import logo from '../../assets/images/logo.png'
import connections from '../../assets/images/connections.png'

function IntroPanel() {
    return (
        <div>
            <img src={logo} className="home-logo"/>
            <div className="my-5">
                <h2 className="home-headline">Connect with your Peers, Friends and other People with ease!</h2>
            </div>
            <div className="home-image">
                <img src={connections} className="home-image-preview"/>
            </div>
        </div>
        );
}

export default IntroPanel;