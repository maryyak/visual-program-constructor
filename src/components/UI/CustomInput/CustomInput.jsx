import styles from './CustomInput.module.scss';

const CustomInput = ({ ...inputProps }) => {
    return (
        <input
            className={styles.input}
            {...inputProps}
        />
    );
};

export default CustomInput;