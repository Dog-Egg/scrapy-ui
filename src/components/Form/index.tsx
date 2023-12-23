import classNames from "classnames";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  useEffect,
  useId,
} from "react";

interface FormProps extends PropsWithChildren {
  className?: string;
  onSubmit?: (data: object) => void;
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
  validators: Array<(value: any) => void>;
}

export const FormItemContext = createContext<FormItemObject | null>(null);

function FormItem(props: FormItemProps) {
  const { children, label, errorMsg: exteralErrMsg, validators } = props;
  const id = useId();

  const [formItem] = useState(() => {
    const obj = new FormItemObject();
    props.prop && obj.setProp(props.prop);
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
    return obj;
  });

  const [interalErrMsg, setInteralErrMsg] = useState("");
  const errMsg = exteralErrMsg || interalErrMsg; // 是否为错误状态

  const form = useContext(FormContext);
  useEffect(() => {
    // 安装/卸载字段
    form?.installItem(id, formItem);
    return () => {
      form?.uninstallItem(id);
    };
  }, [form, id, formItem]);

  return (
    <div className={classNames("group relative mb-6", errMsg && "is-error")}>
      {label && (
        <label className="mb-2 block text-sm font-normal">{label}</label>
      )}
      <FormItemContext.Provider value={formItem}>
        {children}
      </FormItemContext.Provider>
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
  private formItemMap = new Map<string, FormItemObject>();
  installItem(id: string, formItem: FormItemObject) {
    this.formItemMap.set(id, formItem);
  }

  uninstallItem(id: string) {
    this.formItemMap.delete(id);
  }

  getValues() {
    const map = new Map();
    this.formItemMap.forEach((formItem) => {
      const value = formItem.getValue();
      const prop = formItem.getProp();
      if (value !== undefined && prop) {
        map.set(prop, value);
      }
    });
    return Object.fromEntries(map.entries());
  }

  validateFields() {
    let result = true;
    for (const formItem of Array.from(this.formItemMap.values())) {
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

class FormItemObject {
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
  }
  getValue() {
    return this.value;
  }

  validateValue() {
    this.validators.forEach((fn) => {
      fn(this.value);
    });
  }
}
