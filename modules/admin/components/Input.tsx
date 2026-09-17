

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    className?: string;
}

const Input = ({className,label, ...props}: InputProps) =>{
    return (
        <div className="flex flex-col">
            {label && <label className="text-sm mb-1">{label}</label>}
            <input className={`bg-secondary outline-accent p-1 w-full rounded-sm ${className}`} {...props}></input>
        </div>
    )
}

export default Input