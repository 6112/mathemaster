module ApplicationHelper
  def push_button label, id, button_group, checked, classes, other_attrs = {}
    other_attrs_string = ""
    other_attrs.each do |attribute, value|
      value = value.to_s
      value.gsub! /"/, '\\"'
      pair = "#{attribute}=\"#{value}\" "
      other_attrs_string << pair
    end
    raw [
      "<input type='radio' id='#{id}' class='hidden' name='#{button_group}' ",
        "#{checked ? 'checked ' : ''}#{other_attrs_string}/>",
      "<label for='#{id}' class='push-button #{classes.join ' '}'>",
        "#{label}",
      "</label>"
    ].join
  end
end
