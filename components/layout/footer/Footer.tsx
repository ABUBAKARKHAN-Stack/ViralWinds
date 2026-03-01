import ContainerLayout from "../ContainerLayout";
import FooterBottomBar from "./FooterBottomBar";
import FooterCTA from "./FooterCTA";
import FooterMainGrid from "./FooterMainGrid";

const Footer = () => {

  return (
    <footer className="border-t border-border">
      <ContainerLayout className="py-24">

        {/* Footer CTA */}
        <FooterCTA />

        {/* Footer grid */}
        <FooterMainGrid />

        {/* Bottom bar */}
        <FooterBottomBar />

      </ContainerLayout>
    </footer>
  );
};

export default Footer;