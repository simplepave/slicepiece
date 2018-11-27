<?php
class ControllerCommonFooter extends Controller {
	public function index() {
		$this->load->language('common/footer');

        $this->load->model('catalog/category');
        $category_id = 59;
        $category_info = $this->model_catalog_category->getCategory($category_id);

        if ($category_info) {

            $data['category_catalog_title'] = $category_info['name'];

            $data['categories'] = [];
            $results = $this->model_catalog_category->getCategories($category_id);

            foreach ($results as $result) {
                $data['categories'][] = [
                    'name' => $result['name'],
                    'href' => $this->url->link('product/category', 'path=' . $category_id . '_' . $result['category_id']),
                ];
            }
        }

		$this->load->model('catalog/information');

		$data['informations'] = array();

		foreach ($this->model_catalog_information->getInformations() as $result) {
			if ($result['bottom']) {
				$data['informations'][] = array(
					'title' => $result['title'],
					'href'  => $this->url->link('information/information', 'information_id=' . $result['information_id'])
				);
			}
		}

        $about = $this->model_catalog_information->getInformation(4);

        $data['about'] = $this->url->link('information/information', 'information_id=' . $about['information_id']);
        $data['text_about'] = $about['title'];
        $data['home'] = $this->url->link('common/home');
        $data['telephone'] = $this->config->get('config_telephone');
        $data['href_tel'] = href_tel($this->config->get('config_telephone'));
        $data['email'] = $this->config->get('config_email');
        $data['checkout'] = $this->url->link('checkout/simplecheckout', '', true);
        $data['catalog'] = $this->url->link('product/category', 'path=59');
        $data['config_name'] = $this->config->get('config_name');
        $data['config_vk'] = $this->config->get('config_vk');
        $data['config_instagram'] = $this->config->get('config_instagram');
        $data['config_youtube'] = $this->config->get('config_youtube');
        $data['newsblog'] = $this->url->link('newsblog/category', 'newsblog_path=1');

		$data['contact'] = $this->url->link('information/contact');
		$data['return'] = $this->url->link('account/return/add', '', true);
		$data['sitemap'] = $this->url->link('information/sitemap');
		$data['tracking'] = $this->url->link('information/tracking');
		$data['manufacturer'] = $this->url->link('product/manufacturer');
		$data['voucher'] = $this->url->link('account/voucher', '', true);
		$data['affiliate'] = $this->url->link('affiliate/login', '', true);
		$data['special'] = $this->url->link('product/special');
		$data['account'] = $this->url->link('account/account', '', true);
		$data['order'] = $this->url->link('account/order', '', true);
		$data['wishlist'] = $this->url->link('account/wishlist', '', true);
		$data['newsletter'] = $this->url->link('account/newsletter', '', true);

		$data['powered'] = sprintf($this->language->get('text_powered'), $this->config->get('config_name'), date('Y', time()));

		// Whos Online
		if ($this->config->get('config_customer_online')) {
			$this->load->model('tool/online');

			if (isset($this->request->server['REMOTE_ADDR'])) {
				$ip = $this->request->server['REMOTE_ADDR'];
			} else {
				$ip = '';
			}

			if (isset($this->request->server['HTTP_HOST']) && isset($this->request->server['REQUEST_URI'])) {
				$url = ($this->request->server['HTTPS'] ? 'https://' : 'http://') . $this->request->server['HTTP_HOST'] . $this->request->server['REQUEST_URI'];
			} else {
				$url = '';
			}

			if (isset($this->request->server['HTTP_REFERER'])) {
				$referer = $this->request->server['HTTP_REFERER'];
			} else {
				$referer = '';
			}

			$this->model_tool_online->addOnline($ip, $this->customer->getId(), $url, $referer);
		}

		$data['scripts'] = $this->document->getScripts('footer');

		return $this->load->view('common/footer', $data);
	}
}
