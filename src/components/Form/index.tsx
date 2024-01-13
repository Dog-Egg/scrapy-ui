import classNames from "classnames";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  useEffect,
  useId,
} from "react";
import set from "lodash/set";

interface FormProps extends PropsWithChildren {
  className?: string;
  onSubmit?: (values: any) => void;
}

const FormContext = createContext<FormObject | null>(null);

function Form({ children, className, onSubmit }: FormProps) {
  const [form] = useState(() => new FormObject());

  return (
    <form
      className={classNames(className)}
      onSubmit={(e) => {
        e.preventDefault();
        if (form.validateFields()) {
          onSubmit && onSubmit(form.getValues());
        }
        return false;
      }}
    >
      <FormContext.Provider value={form}>{children}</FormContext.Provider>
    </form>
  );
}

interface FormItemProps extends PropsWithChildren {
  prop?: string;
  label?: string;
  errorMsg?: string;
  validators?: Array<(value: any) => void>;
  onClearErrorMsg?: () => void;
}

const FormFieldContext = createContext<FormField | null>(null);

export function useFormField() {
  return useContext(FormFieldContext);
}

function FormItem(props: FormItemProps) {
  const {
    children,
    label,
    errorMsg: exteralErrMsg,
    validators,
    onClearErrorMsg,
  } = props;
  const id = useId();

  const [formItem] = useState(() => {
    const obj = new FormField();
    props.prop && obj.setProp(props.prop);
    validators &&
      obj.setValidators(
        validators.map((fn) => {
          return (value) => {
            try {
              fn(value);
            } catch (e) {
              if (e instanceof Error) {
                setInteralErrMsg(e.message);
              }
              throw e;
            }
          };
        }),
      );
    obj.onValueChange(() => {
      // 字段输入改变后清除错误消息。
      setInteralErrMsg(""); // 清除内部错误信息
      onClearErrorMsg && onClearErrorMsg(); // 通知清楚外部传入的错误信息
    });
    return obj;
  });

  const [interalErrMsg, setInteralErrMsg] = useState("");
  const errMsg = exteralErrMsg || interalErrMsg; // 是否为错误状态

  const form = useContext(FormContext);
  useEffect(() => {
    // 安装/卸载字段
    form?.installField(id, formItem);
    return () => {
      form?.uninstallItem(id);
    };
  }, [form, id, formItem]);

  return (
    <div className={classNames("group relative mb-6", errMsg && "is-error")}>
      {label && (
        <label className="mb-2 block text-sm font-normal">{label}</label>
      )}
      <FormFieldContext.Provider value={formItem}>
        {children}
      </FormFieldContext.Provider>
      {errMsg && (
        <span className="absolute -bottom-5 left-0 text-xs text-danger">
          {errMsg}
        </span>
      )}
    </div>
  );
}

Form.Item = FormItem;
export default Form;

class FormObject {
  private formFieldMap = new Map<string, FormField>();
  installField(id: string, formField: FormField) {
    this.formFieldMap.set(id, formField);
  }

  uninstallItem(id: string) {
    this.formFieldMap.delete(id);
  }

  getValues() {
    const values = {};
    this.formFieldMap.forEach((formField) => {
      const value = formField.getValue();
      const prop = formField.getProp();
      if (value !== undefined && prop) {
        set(values, prop, value);
      }
    });
    return values;
  }

  validateFields() {
    let result = true;
    for (const formItem of Array.from(this.formFieldMap.values())) {
      try {
        formItem.validateValue();
      } catch (e) {
        result = false;
        if (e instanceof Error) {
          console.warn("form error:", {
            [formItem.getProp() || "<unknown field>"]: e.message,
          });
        }
      }
    }
    return result;
  }
}

class FormField {
  private prop: string | undefined;
  private value = undefined;
  private validators: ((value: any) => void)[] = [];

  setValidators(values: typeof this.validators) {
    this.validators = values;
  }

  setProp(prop: string) {
    this.prop = prop;
  }

  getProp() {
    return this.prop;
  }

  setValue(value: any) {
    this.value = value;
    this.valueChangeFunctions.forEach((fn) => {
      fn();
    });
  }
  getValue() {
    return this.value;
  }

  validateValue() {
    this.validators.forEach((fn) => {
      fn(this.value);
    });
  }

  private valueChangeFunctions: Function[] = [];
  onValueChange(callback: Function) {
    this.valueChangeFunctions.push(callback);
  }
}
