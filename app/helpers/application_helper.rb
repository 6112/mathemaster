module ApplicationHelper
  def push_button label, id, button_group, checked, classes
    raw [
      "<input type='radio' id='#{id}' class='hidden' name='#{button_group}' ",
        "value=#{checked ? 1 : 0} />",
      "<label for='#{id}' class='push-button #{classes.join ' '}'>",
        "#{label}",
      "</label>"
    ].join
  end
end
