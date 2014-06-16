require 'test_helper'

class TestControllerTest < ActionController::TestCase
  test "should get clock" do
    get :clock
    assert_response :success
  end

  test "should get push_button" do
    get :push_button
    assert_response :success
  end

  test "should get pie_chart" do
    get :pie_chart
    assert_response :success
  end

end
