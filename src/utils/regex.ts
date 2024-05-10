enum ValidationTypes {
  email,
  name,
  password
}

function validateThis(validate: string, type: ValidationTypes) {
  switch (type) {
    case ValidationTypes.email: {
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
      return emailRegex.test(validate)
    }
    case ValidationTypes.password: {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
      return passwordRegex.test(validate)
    }
    case ValidationTypes.name: {
      const nameRegex = /^[a-zA-Z\s]+$/
      return nameRegex.test(validate)
    }
    default:
      return false
  }
}

export default validateThis
