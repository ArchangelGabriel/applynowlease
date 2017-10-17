const extractApplicationOptions = (application) => {
  const templateId = application.property.templateId
  if (application.property.templateId) {
    let opts = {
      template_id: templateId,
      signers: [{
        email_address: application.email,
        name: application.fullName,
        role: 'Client'
      }]
    }
    return opts
  }
  return null
}

export default extractApplicationOptions