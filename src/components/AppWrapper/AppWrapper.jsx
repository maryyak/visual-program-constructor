import styles from './AppWrapper.module.scss'
import BackButton from "../BackButton/BackButton";

const AppWrapper = ({children}) => {
    return (
        <div className={styles.app}>
            <BackButton/>
            {children}
        </div>
    );
};

export default AppWrapper;