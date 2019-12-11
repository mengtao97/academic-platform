module.exports.validateRegisterInput = (
    username,
    email,
    password,
) => {
    const errors = {};
    if (username.trim() === '') {
        errors.username = '用户名不能为空';
    }
    if (email.trim() === '') {
        errors.email = '邮箱不能为空';
    } else {
        const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!email.match(regEx)) {
            errors.email = '无效的邮箱地址';
        }
    }
    if (password === '') {
        errors.password = '密码不能为空';
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
};

module.exports.validateLoginInput = (email, password) => {
    const errors = {};
    if (email.trim() === '') {
        errors.email = '邮箱不能为空';
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if (!email.match(regEx)) {
            errors.email = '无效的邮箱地址';
        }
    }
    if (password.trim() === '') {
        errors.password = '密码不能为空';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    };
};